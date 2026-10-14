import VendorModel from "../../models/vendor/AuthModel.js";
import crypto from "crypto";
import { encryptCredential } from "../../utils/credentialEncryption.js";
import {
  createRouteLinkedAccount,
  createRouteStakeholder,
  getRouteLinkedAccount,
  getRouteProductConfig,
  requestRouteProductConfig,
  updateRouteProductConfig,
} from "../../Services/RazorpayRoute.js";
import { authenticateShiprocketCredentials } from "../../Services/ShipRocket.js";

const routeBusinessTypes = new Set([
  "educational_institutes",
  "individual",
  "llp",
  "ngo",
  "other",
  "partnership",
  "private_limited",
  "proprietorship",
  "public_limited",
  "society",
  "trust",
]);

const getOnboardingIdempotencyKey = (payload) => {
  const platformSecret = process.env.RAZORPAY_SECRET;
  if (!platformSecret) {
    throw new Error("Platform Razorpay credentials are not configured");
  }

  const value = crypto
    .createHmac("sha256", platformSecret)
    .update(JSON.stringify(payload))
    .digest("hex")
    .slice(0, 32)
    .split("");
  value[12] = "5";
  value[16] = ((Number.parseInt(value[16], 16) & 3) | 8).toString(16);

  return `${value.slice(0, 8).join("")}-${value.slice(8, 12).join("")}-${value.slice(12, 16).join("")}-${value.slice(16, 20).join("")}-${value.slice(20).join("")}`;
};

const razorpayStatus = (integration = {}) => ({
  isLinked: Boolean(integration.linkedAccountId),
  accountStatus: integration.accountStatus || "",
  productActivationStatus: integration.productActivationStatus || "",
  settlementVerificationStatus:
    integration.settlementVerificationStatus || "",
});

const configurationStatus = (vendor) => ({
  razorpay: {
    ...razorpayStatus(vendor.integrations?.razorpay),
    enabled: Boolean(vendor.integrations?.razorpay?.enabled),
  },
  shiprocket: {
    enabled: Boolean(vendor.integrations?.shiprocket?.enabled),
    hasEmail: Boolean(vendor.integrations?.shiprocket?.emailEncrypted),
    hasPassword: Boolean(vendor.integrations?.shiprocket?.passwordEncrypted),
  },
});

export const getVendorIntegrations = async (req, res) => {
  const vendor = await VendorModel.findById(req.vendor._id).select(
    "+integrations.shiprocket.emailEncrypted +integrations.shiprocket.passwordEncrypted",
  );

  if (!vendor) {
    return res.status(404).json({ success: false, message: "Vendor not found" });
  }

  return res.status(200).json({
    success: true,
    integrations: configurationStatus(vendor),
    pickupAddress: vendor.pickupAddress || {},
  });
};

export const updateVendorIntegrations = async (req, res) => {
  let failureStage = "load vendor integration";
  try {
    const shiprocket = req.body?.shiprocket;
    if (req.body?.razorpay !== undefined) {
      return res.status(400).json({
        success: false,
        message: "Razorpay Route linked accounts must be provisioned by the platform",
      });
    }
    const vendor = await VendorModel.findById(req.vendor._id).select(
      "+integrations.shiprocket.emailEncrypted +integrations.shiprocket.passwordEncrypted",
    );

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    if (shiprocket !== undefined) {
      if (!shiprocket || typeof shiprocket !== "object" || Array.isArray(shiprocket)) {
        return res.status(400).json({ success: false, message: "Invalid Shiprocket configuration" });
      }

      const hasEmail = typeof shiprocket.email === "string" && shiprocket.email.trim();
      const hasPassword = typeof shiprocket.password === "string" && shiprocket.password.trim();
      if (hasEmail || hasPassword) {
        if (!hasEmail || !hasPassword) {
          return res.status(400).json({
            success: false,
            message: "Enter both the Shiprocket API user email and password",
          });
        }

        const email = shiprocket.email.trim().toLowerCase();
        const password = shiprocket.password.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return res.status(400).json({
            success: false,
            message: "Enter a valid Shiprocket API user email",
          });
        }
        if (shiprocket.password.length > 256) {
          return res.status(400).json({
            success: false,
            message: "Shiprocket password is too long",
          });
        }

        failureStage = "authenticate Shiprocket credentials";
        try {
          await authenticateShiprocketCredentials({ email, password });
        } catch (error) {
          const invalidCredentials = [400, 401, 403, 422].includes(error.response?.status);
          const statusCode = invalidCredentials ? 400 : error.response ? 502 : 503;
          return res.status(statusCode).json({
            success: false,
            message: invalidCredentials
              ? "Shiprocket authentication failed. Check the API user email, password, and account API access."
              : "Could not reach Shiprocket to validate credentials. Please try again later.",
          });
        }

        failureStage = "encrypt Shiprocket credentials";
        vendor.integrations.shiprocket.emailEncrypted = encryptCredential(email);
        vendor.integrations.shiprocket.passwordEncrypted = encryptCredential(password);
        vendor.integrations.shiprocket.enabled = true;
      } else if (shiprocket.enabled !== undefined) {
        if (typeof shiprocket.enabled !== "boolean") {
          return res.status(400).json({ success: false, message: "Shiprocket enabled must be a boolean" });
        }
        if (shiprocket.enabled) {
          return res.status(400).json({
            success: false,
            message: "Connect Shiprocket with an API user email and password before enabling it",
          });
        }
        vendor.integrations.shiprocket.enabled = false;
      }
    }

    failureStage = "save vendor integration to MongoDB";
    await vendor.save();
    if (shiprocket !== undefined) {
      console.info("Vendor Shiprocket integration saved", {
        vendorId: String(vendor._id),
        enabled: Boolean(vendor.integrations?.shiprocket?.enabled),
        hasEncryptedEmail: Boolean(vendor.integrations?.shiprocket?.emailEncrypted),
        hasEncryptedPassword: Boolean(vendor.integrations?.shiprocket?.passwordEncrypted),
      });
    }
    return res.status(200).json({
      success: true,
      message: "Vendor integrations saved",
      integrations: configurationStatus(vendor),
    });
  } catch (error) {
    const encryptionConfigurationError = String(error.message || "").includes(
      "INTEGRATION_ENCRYPTION_KEY",
    );
    console.error("Vendor integration update failed", {
      vendorId: String(req.vendor?._id || ""),
      stage: failureStage,
      errorName: error.name || "Error",
      errorCode: typeof error.code === "string" || typeof error.code === "number"
        ? error.code
        : undefined,
      encryptionKeyConfigured: Boolean(process.env.INTEGRATION_ENCRYPTION_KEY),
    });

    return res.status(500).json({
      success: false,
      message: encryptionConfigurationError
        ? "Shiprocket credentials cannot be saved because backend encryption is not configured. Contact support."
        : "Could not save vendor integrations",
    });
  }
};

const getSettlementVerificationStatus = (product) => {
  const settlementAccount =
    product.active_configuration?.settlement_accounts?.[0] ||
    product.requested_configuration?.settlement_accounts?.[0];

  return settlementAccount?.verification_status || "pending";
};

const getSafeRouteOnboardingHint = (providerError = {}) => {
  const description = String(providerError.description || providerError.reason || "").toLowerCase();
  if (/email/.test(description) && /(already exists|already used|duplicate)/.test(description)) {
    return "This email is already associated with a linked account on the platform Razorpay account. Ask platform support to check the existing account.";
  }
  if (/(marketplace|route)/.test(description) && /(not enabled|not available|not found|disabled)/.test(description)) {
    return "Linked-account access may not be enabled for the platform Razorpay account. The platform owner must confirm Route/Marketplace access with Razorpay.";
  }
  if (/(required|missing|mandatory)/.test(description)) {
    return "Razorpay reports a required linked-account field is missing. Recheck business name, business type, product category, website, registered address, PAN and vendor contact details.";
  }
  if (/(pan|gst|tax|kyc)/.test(description)) {
    return "Razorpay rejected a legal or tax detail. Check the business PAN/GST and that they match the selected business type and legal records.";
  }
  if (/(invalid|not valid|format)/.test(description) && /(name|business|phone|email|address|website|url|category|subcategory)/.test(description)) {
    return "Razorpay rejected the format of a linked-account business detail. Check the legal name, contact details, category, website and registered address.";
  }
  return "Razorpay rejected the linked-account details or platform account setup. Check Route/Marketplace access with platform support; the dashboard message does not identify a specific field.";
};

export const refreshVendorRazorpayStatus = async (req, res) => {
  try {
    const vendor = await VendorModel.findById(req.vendor._id);
    const integration = vendor?.integrations?.razorpay;

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    if (!integration?.linkedAccountId) {
      return res.status(200).json({
        success: true,
        razorpay: razorpayStatus(integration),
      });
    }

    const account = await getRouteLinkedAccount(integration.linkedAccountId);
    let product = null;

    if (integration.productConfigId) {
      product = await getRouteProductConfig(
        integration.linkedAccountId,
        integration.productConfigId,
      );
    }

    integration.accountStatus = account.status || "";
    integration.productActivationStatus = product?.activation_status || "";
    integration.settlementVerificationStatus = product
      ? getSettlementVerificationStatus(product)
      : "pending";
    integration.enabled =
      integration.accountStatus === "created" &&
      integration.productActivationStatus === "activated" &&
      integration.settlementVerificationStatus === "verified";
    await vendor.save();

    return res.status(200).json({
      success: true,
      razorpay: razorpayStatus(integration),
    });
  } catch {
    return res.status(502).json({
      success: false,
      message: "Could not refresh Razorpay onboarding status",
    });
  }
};

export const onboardVendorWithRazorpayRoute = async (req, res) => {
  const vendorId = req.vendor._id;
  let failureStage = "validate onboarding details";
  let onboardingReserved = false;

  try {
    const legalBusinessName = String(req.body?.legalBusinessName || "").trim();
    const businessType = String(req.body?.businessType || "").trim();
    const pan = String(req.body?.pan || "").trim().toUpperCase();
    const stakeholderPan = String(req.body?.stakeholderPan || pan).trim().toUpperCase();
    const gst = String(req.body?.gst || "").trim().toUpperCase();
    const beneficiaryName = String(req.body?.beneficiaryName || "").trim();
    const accountNumber = String(req.body?.accountNumber || "").trim();
    const ifscCode = String(req.body?.ifscCode || "").trim().toUpperCase();
    const businessSubcategory = String(req.body?.businessSubcategory || "").trim();
    const websiteUrl = String(req.body?.websiteUrl || "").trim();
    const registeredAddress = {
      street1: String(req.body?.registeredAddress?.street1 || "").trim(),
      street2: String(req.body?.registeredAddress?.street2 || "").trim(),
      city: String(req.body?.registeredAddress?.city || "").trim(),
      state: String(req.body?.registeredAddress?.state || "").trim(),
      postal_code: String(req.body?.registeredAddress?.postalCode || "").trim(),
      country: "IN",
    };
    const residentialAddress = {
      street: String(req.body?.residentialAddress?.street || "").trim(),
      city: String(req.body?.residentialAddress?.city || "").trim(),
      state: String(req.body?.residentialAddress?.state || "").trim(),
      postal_code: String(req.body?.residentialAddress?.postalCode || "").trim(),
      country: "IN",
    };

    if (req.body?.tncAccepted !== true) {
      return res.status(400).json({
        success: false,
        message: "Accept Razorpay Route terms before continuing",
      });
    }

    if (legalBusinessName.length < 4 || legalBusinessName.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Legal business name must be 4 to 200 characters",
      });
    }

    if (!routeBusinessTypes.has(businessType)) {
      return res.status(400).json({
        success: false,
        message: "Select a valid business type",
      });
    }

    const routeEcommerceSubcategories = new Set([
      "ecommerce_marketplace", "agriculture", "books", "electronics_and_furniture",
      "fashion_and_lifestyle", "gifting", "grocery", "baby_products", "office_supplies",
      "wholesale", "pet_products", "sports_products", "arts_and_collectibles",
      "jewellery_and_watch_stores", "cosmetic_stores", "home_furnishing_stores",
      "computer_software_stores", "women_clothing", "department_stores", "variety_stores",
    ]);
    if (!routeEcommerceSubcategories.has(businessSubcategory)) {
      return res.status(400).json({ success: false, message: "Select a valid Razorpay e-commerce business category" });
    }

    if (
      registeredAddress.street1.length < 3 || registeredAddress.street1.length > 100 ||
      !registeredAddress.city || registeredAddress.city.length > 100 ||
      registeredAddress.state.length < 2 || registeredAddress.state.length > 32 ||
      !/^\d{6}$/.test(registeredAddress.postal_code)
    ) {
      return res.status(400).json({ success: false, message: "Enter the complete registered business address and six-digit PIN code" });
    }

    try {
      const parsedWebsite = new URL(websiteUrl);
      if (!["http:", "https:"].includes(parsedWebsite.protocol) || !parsedWebsite.hostname.includes(".")) {
        throw new Error("Invalid website URL");
      }
    } catch {
      return res.status(400).json({ success: false, message: "Enter a valid public business website or storefront URL starting with https://" });
    }

    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(pan)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid PAN number",
      });
    }

    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(stakeholderPan)) {
      return res.status(400).json({ success: false, message: "Enter a valid PAN for the owner or authorized stakeholder" });
    }

    if (Object.values(residentialAddress).some((value) => !value) || !/^\d{6}$/.test(residentialAddress.postal_code)) {
      return res.status(400).json({ success: false, message: "Enter the stakeholder's complete residential address and six-digit postal code" });
    }

    if (gst && !/^\d{2}[A-Z0-9]{13}$/.test(gst)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 15-character GSTIN",
      });
    }

    if (accountNumber.length < 5 || accountNumber.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Bank account number must be 5 to 20 characters",
      });
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 11-character IFSC code",
      });
    }

    if (beneficiaryName.length < 2 || beneficiaryName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Enter the bank account holder name",
      });
    }

    const phone = String(req.vendor.phone || "").replace(/\D/g, "");
    if (!req.vendor.email || phone.length < 8 || phone.length > 15) {
      return res.status(400).json({
        success: false,
        message: "Update your vendor email and phone before Route onboarding",
      });
    }

    const existingVendor = await VendorModel.findById(vendorId);
    if (existingVendor?.integrations?.razorpay?.enabled) {
      return res.status(409).json({
        success: false,
        message: "This Razorpay Route account is already active",
      });
    }

    const payload = {
      type: "route",
      tnc_accepted: true,
      legal_business_name: legalBusinessName,
      customer_facing_business_name: req.vendor.businessName,
      business_type: businessType,
      email: req.vendor.email,
      phone: phone.length === 10 ? `+91${phone}` : phone,
      profile: {
        category: "ecommerce",
        subcategory: businessSubcategory,
        business_model: `${businessType.replaceAll("_", " ")} seller on VendoraFlame marketplace`.slice(0, 255),
        addresses: { registered: registeredAddress },
        apps: { websites: [{ url: websiteUrl }] },
      },
      legal_info: {
        pan,
        ...(gst ? { gst } : {}),
      },
    };
    const idempotencyKey = getOnboardingIdempotencyKey({ vendorId: String(vendorId), flow: "route-linked-account-v1" });
    failureStage = "reserve vendor onboarding";
    const vendor = await VendorModel.findOneAndUpdate(
      {
        _id: vendorId,
        "integrations.razorpay.onboardingInProgress": { $ne: true },
      },
      {
        $set: { "integrations.razorpay.onboardingInProgress": true },
      },
      { new: true },
    );

    if (!vendor) {
      return res.status(409).json({
        success: false,
        message: "Razorpay onboarding is already linked or in progress",
      });
    }
    onboardingReserved = true;

    const routeIntegration = vendor.integrations.razorpay;
    if (!routeIntegration.linkedAccountId) {
      failureStage = "create Razorpay linked account";
      const routeAccount = await createRouteLinkedAccount(payload, idempotencyKey);
      if (!routeAccount?.id) throw new Error("Razorpay did not return a linked account ID");
      routeIntegration.linkedAccountId = routeAccount.id;
      routeIntegration.accountStatus = routeAccount.status || "created";
      routeIntegration.productConfigId = routeAccount.product_config?.id || "";
      routeIntegration.productActivationStatus = routeAccount.product_config?.activation_status || "";
      await vendor.save();
    }

    if (!routeIntegration.stakeholderId) {
      failureStage = "create Razorpay stakeholder";
      const stakeholder = await createRouteStakeholder(routeIntegration.linkedAccountId, {
        name: String(req.vendor.ownerName || "").trim(),
        email: req.vendor.email,
        phone: { primary: Number(phone.slice(-10)) },
        addresses: { residential: residentialAddress },
        kyc: { pan: stakeholderPan },
      });
      routeIntegration.stakeholderId = stakeholder.id;
      await vendor.save();
    }

    failureStage = routeIntegration.productConfigId
      ? "fetch Razorpay Route product configuration"
      : "request Razorpay Route product configuration";
    let productConfig = routeIntegration.productConfigId
      ? await getRouteProductConfig(routeIntegration.linkedAccountId, routeIntegration.productConfigId)
      : await requestRouteProductConfig(routeIntegration.linkedAccountId);
    if (!routeIntegration.productConfigId) {
      routeIntegration.productConfigId = productConfig.id || "";
      routeIntegration.productActivationStatus = productConfig.activation_status || "requested";
      if (!routeIntegration.productConfigId) throw new Error("Razorpay did not return a product configuration ID");
      await vendor.save();
    }

    failureStage = "submit Razorpay settlement bank details";
    productConfig = await updateRouteProductConfig(
      routeIntegration.linkedAccountId,
      routeIntegration.productConfigId,
      {
        settlement_accounts: [{
          method: "bank_account",
          bank_account: {
            account_number: accountNumber,
            beneficiary_name: beneficiaryName,
            code_type: "ifsc",
            code: ifscCode,
            currency: "INR",
            is_default: true,
          },
        }],
        tnc_accepted: true,
      },
    );
    const settlementAccount =
      productConfig.active_configuration?.settlement_accounts?.[0] ||
      productConfig.requested_configuration?.settlement_accounts?.[0];

    failureStage = "refresh Razorpay account status";
    const routeAccount = await getRouteLinkedAccount(routeIntegration.linkedAccountId);
    routeIntegration.accountStatus = routeAccount.status || routeIntegration.accountStatus;
    routeIntegration.productActivationStatus =
      productConfig.activation_status || "requested";
    routeIntegration.settlementVerificationStatus =
      settlementAccount?.verification_status || "pending";
    routeIntegration.enabled =
      routeIntegration.accountStatus === "created" &&
      routeIntegration.productActivationStatus === "activated" &&
      routeIntegration.settlementVerificationStatus === "verified";
    routeIntegration.onboardingInProgress = false;
    await vendor.save();

    return res.status(201).json({
      success: true,
      message: "Razorpay Route onboarding submitted",
      razorpay: razorpayStatus(routeIntegration),
    });
  } catch (error) {
    if (onboardingReserved) {
      await VendorModel.updateOne(
        { _id: vendorId },
        { $set: { "integrations.razorpay.onboardingInProgress": false } },
      ).catch(() => {});
    }
    const providerStatus = error.response?.status;
    const providerCode = error.response?.data?.error?.code;
    const providerHint = providerStatus
      ? getSafeRouteOnboardingHint(error.response?.data?.error)
      : "";
    const allowedProviderCode = typeof providerCode === "string" && /^[A-Z0-9_]{1,64}$/.test(providerCode)
      ? providerCode
      : undefined;
    console.error("Razorpay vendor onboarding failed", {
      vendorId: String(vendorId),
      stage: failureStage,
      providerStatus,
      providerCode: allowedProviderCode,
      providerHint,
      errorName: error.name || "Error",
    });
    const statusCode = [400, 401, 403, 422].includes(providerStatus)
      ? 400
      : providerStatus
        ? 502
        : 500;
    return res.status(statusCode).json({
      success: false,
      message: providerStatus
        ? `Razorpay rejected the ${failureStage} request${allowedProviderCode ? ` (${allowedProviderCode})` : ""}. ${providerHint}`
        : "Could not reach Razorpay to complete onboarding. Refresh provider status before retrying.",
    });
  }
};
