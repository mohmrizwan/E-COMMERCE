import VendorModel from "../../models/vendor/AuthModel.js";
import crypto from "crypto";
import { encryptCredential } from "../../utils/credentialEncryption.js";
import {
  createRouteLinkedAccount,
  getRouteLinkedAccount,
  getRouteProductConfig,
} from "../../Services/RazorpayRoute.js";

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
      if (typeof shiprocket.email === "string" && shiprocket.email.trim()) {
        const email = shiprocket.email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return res.status(400).json({
            success: false,
            message: "Enter a valid Shiprocket account email",
          });
        }
        vendor.integrations.shiprocket.emailEncrypted = encryptCredential(email);
      }
      if (typeof shiprocket.password === "string" && shiprocket.password.trim()) {
        if (shiprocket.password.length > 256) {
          return res.status(400).json({
            success: false,
            message: "Shiprocket password is too long",
          });
        }
        vendor.integrations.shiprocket.passwordEncrypted = encryptCredential(shiprocket.password.trim());
      }
      if (shiprocket.enabled !== undefined) {
        if (typeof shiprocket.enabled !== "boolean") {
          return res.status(400).json({ success: false, message: "Shiprocket enabled must be a boolean" });
        }
        if (
          shiprocket.enabled &&
          !(vendor.integrations.shiprocket.emailEncrypted && vendor.integrations.shiprocket.passwordEncrypted)
        ) {
          return res.status(400).json({ success: false, message: "Save Shiprocket credentials before enabling the integration" });
        }
        vendor.integrations.shiprocket.enabled = shiprocket.enabled;
      }
    }

    await vendor.save();
    return res.status(200).json({
      success: true,
      message: "Vendor integrations saved",
      integrations: configurationStatus(vendor),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not save vendor integrations",
    });
  }
};

const getSettlementVerificationStatus = (product) => {
  const settlementAccount =
    product.active_configuration?.settlement_accounts?.[0] ||
    product.requested_configuration?.settlement_accounts?.[0];

  return settlementAccount?.verification_status || "pending";
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

  try {
    const legalBusinessName = String(
      req.body?.legalBusinessName || "",
    ).trim();
    const businessType = String(req.body?.businessType || "").trim();
    const pan = String(req.body?.pan || "").trim().toUpperCase();
    const gst = String(req.body?.gst || "").trim().toUpperCase();
    const beneficiaryName = String(
      req.body?.beneficiaryName || "",
    ).trim();
    const accountNumber = String(req.body?.accountNumber || "").trim();
    const ifscCode = String(req.body?.ifscCode || "").trim().toUpperCase();

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

    if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(pan)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid PAN number",
      });
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
    if (existingVendor?.integrations?.razorpay?.linkedAccountId) {
      return res.status(409).json({
        success: false,
        message: "A Razorpay linked account already exists for this vendor",
      });
    }

    const payload = {
      type: "route",
      tnc_accepted: true,
      reference_id: vendor._id.toString(),
      legal_business_name: legalBusinessName,
      customer_facing_business_name: vendor.businessName,
      business_type: businessType,
      email: vendor.email,
      phone: phone.length === 10 ? `+91${phone}` : phone,
      legal_info: {
        pan,
        ...(gst ? { gst } : {}),
      },
      settlement_accounts: [
        {
          method: "bank_account",
          bank_account: {
            account_number: accountNumber,
            beneficiary_name: beneficiaryName,
            code_type: "ifsc",
            code: ifscCode,
            currency: "INR",
            is_default: true,
          },
        },
      ],
    };
    const idempotencyKey = getOnboardingIdempotencyKey(payload);
    const vendor = await VendorModel.findOneAndUpdate(
      {
        _id: vendorId,
        "integrations.razorpay.linkedAccountId": { $in: ["", null] },
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

    let routeAccount;
    try {
      routeAccount = await createRouteLinkedAccount(
        payload,
        idempotencyKey,
      );
    } catch (error) {
      vendor.integrations.razorpay.onboardingInProgress = false;
      await vendor.save();

      return res.status(error.response?.status === 400 ? 400 : 502).json({
        success: false,
        message:
          error.response?.data?.error?.description ||
          "Razorpay could not start vendor onboarding",
      });
    }

    const routeIntegration = vendor.integrations.razorpay;
    const productConfig = routeAccount.product_config || {};
    const settlementAccount =
      productConfig.active_configuration?.settlement_accounts?.[0] ||
      productConfig.requested_configuration?.settlement_accounts?.[0];

    routeIntegration.linkedAccountId = routeAccount.id;
    routeIntegration.accountStatus = routeAccount.status || "created";
    routeIntegration.productConfigId = productConfig.id || "";
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
  } catch {
    return res.status(500).json({
      success: false,
      message: "Could not submit Razorpay Route onboarding",
    });
  }
};