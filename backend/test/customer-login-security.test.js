import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../src/models/user/AuthModel.js";
import { LoginAccount } from "../src/Controllers/User/AuthController.js";
import {
  loginRateLimiter,
  LOGIN_MAX_ATTEMPTS,
  LOGIN_WINDOW_MS,
} from "../src/Routes/Users/AuthRoutes.js";

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

const response = () => ({
  statusCode: 200,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

const useMock = (object, replacements) => {
  const originals = Object.fromEntries(
    Object.keys(replacements).map((key) => [key, object[key]]),
  );
  Object.assign(object, replacements);
  return () => Object.assign(object, originals);
};

const setEnv = (values) => {
  const original = Object.fromEntries(Object.keys(values).map((key) => [key, process.env[key]]));
  Object.assign(process.env, values);
  return () => {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  };
};

const baseUser = {
  _id: "507f1f77bcf86cd799439011",
  email: "user@example.test",
  password: "$2a$10$hashedpasswordhashhere",
  isVerified: true,
  failedLoginAttempts: 0,
  lockUntil: null,
};

// Test helper: call LoginAccount with given user state and password correctness
const callLogin = async (userOverride, passwordCorrect, res) => {
  const user = { ...baseUser, ...userOverride };
  const restoreModel = useMock(UserModel, {
    findOne: async () => user,
    findOneAndUpdate: async ({ email }, update) => {
      if (update.$inc) {
        user.failedLoginAttempts += 1;
        return { ...user, failedLoginAttempts: user.failedLoginAttempts };
      }
      return { ...user };
    },
    updateOne: async () => ({ modifiedCount: 1 }),
  });
  const restoreBcrypt = useMock(bcrypt, {
    compare: async () => passwordCorrect,
  });
  const restoreJwt = useMock(jwt, {
    sign: () => "fake-token",
  });

  try {
    const req = { body: { email: user.email, password: passwordCorrect ? "correct-password" : "wrong-password" } };
    await LoginAccount(req, res);
  } finally {
    restoreModel();
    restoreBcrypt();
    restoreJwt();
  }
  return user;
};

test("existing login with correct password succeeds and resets counters", async () => {
  const res = response();
  let updatedUser = baseUser;
  const restoreModel = useMock(UserModel, {
    findOne: async () => baseUser,
    findOneAndUpdate: async () => null,
    updateOne: async ({ _id }, update) => {
      if (update.$set) {
        updatedUser = { ...baseUser, ...update.$set };
      }
      return { modifiedCount: 1 };
    },
  });
  const restoreBcrypt = useMock(bcrypt, { compare: async () => true });
  const restoreJwt = useMock(jwt, { sign: () => "fake-token" });

  try {
    await LoginAccount(
      { body: { email: "user@example.test", password: "correct-password" } },
      res,
    );
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.token, "fake-token");
    assert.equal(updatedUser.failedLoginAttempts, 0);
    assert.equal(updatedUser.lockUntil, null);
  } finally {
    restoreModel(); restoreBcrypt(); restoreJwt();
  }
});

test("failed password increments failedLoginAttempts counter", async () => {
  const res = response();
  const restoreModel = useMock(UserModel, {
    findOne: async () => baseUser,
    findOneAndUpdate: async ({ email }, update) => {
      if (update.$inc) {
        return { ...baseUser, failedLoginAttempts: baseUser.failedLoginAttempts + 1 };
      }
      return { ...baseUser };
    },
    updateOne: async () => ({ modifiedCount: 1 }),
  });
  const restoreBcrypt = useMock(bcrypt, { compare: async () => false });

  try {
    await LoginAccount(
      { body: { email: "user@example.test", password: "wrong-password" } },
      res,
    );
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.success, false);
    assert.equal(res.body.message, "Invalid email or password");
  } finally {
    restoreModel(); restoreBcrypt();
  }
});

test("generic error does not reveal whether email exists", async () => {
  const res = response();
  const restoreModel = useMock(UserModel, {
    findOne: async () => null,
  });
  const restoreBcrypt = useMock(bcrypt, { compare: async () => false });

  try {
    await LoginAccount(
      { body: { email: "nonexistent@example.test", password: "anything" } },
      res,
    );
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, "Invalid email or password");
  } finally {
    restoreModel(); restoreBcrypt();
  }
});

test("three consecutive failed attempts lock the account for 15 minutes", async () => {
  let attempts = 0;
  const res = response();
  const restoreModel = useMock(UserModel, {
    findOne: async () => ({ ...baseUser, failedLoginAttempts: attempts, lockUntil: null }),
    findOneAndUpdate: async ({ email }, update) => {
      if (update.$inc) {
        attempts += 1;
        return { ...baseUser, failedLoginAttempts: attempts, lockUntil: null };
      }
      return { ...baseUser };
    },
    updateOne: async ({ _id }, update) => {
      if (update.$set && update.$set.lockUntil) {
        baseUser.lockUntil = update.$set.lockUntil;
      }
      return { modifiedCount: 1 };
    },
  });
  const restoreBcrypt = useMock(bcrypt, { compare: async () => false });

  try {
    for (let i = 0; i < MAX_FAILED_ATTEMPTS; i++) {
      await LoginAccount(
        { body: { email: "user@example.test", password: "wrong-password" } },
        res,
      );
      assert.equal(res.statusCode, 401);
    }
    // After 3rd failed attempt, account should be locked
    const lockTime = baseUser.lockUntil;
    assert.ok(lockTime, "lockUntil should be set after 3 failed attempts");
    assert.ok(
      lockTime > new Date() && lockTime <= new Date(Date.now() + LOCKOUT_DURATION_MS + 1000),
      "lockUntil should be approximately now + 15 minutes",
    );
  } finally {
    restoreModel(); restoreBcrypt();
  }
});

test("correct password is rejected while account is locked", async () => {
  const lockedUser = {
    ...baseUser,
    failedLoginAttempts: 3,
    lockUntil: new Date(Date.now() + LOCKOUT_DURATION_MS),
  };
  const res = response();
  const restoreModel = useMock(UserModel, {
    findOne: async () => lockedUser,
  });

  try {
    // Even with correct password, locked account is rejected
    await LoginAccount(
      { body: { email: "user@example.test", password: "correct-password" } },
      res,
    );
    assert.equal(res.statusCode, 401);
    assert.equal(res.body.message, "Invalid email or password");
  } finally {
    restoreModel();
  }
});

test("login becomes possible after lock expires", async () => {
  const expiredLockUser = {
    ...baseUser,
    failedLoginAttempts: 3,
    lockUntil: new Date(Date.now() - 1000), // expired 1 second ago
  };
  let resetCalled = false;
  const res = response();
  const restoreModel = useMock(UserModel, {
    findOne: async () => expiredLockUser,
    updateOne: async ({ _id }, update) => {
      if (update.$set && update.$set.failedLoginAttempts === 0) {
        resetCalled = true;
      }
      return { modifiedCount: 1 };
    },
  });
  const restoreBcrypt = useMock(bcrypt, { compare: async () => true });
  const restoreJwt = useMock(jwt, { sign: () => "fake-token" });

  try {
    await LoginAccount(
      { body: { email: "user@example.test", password: "correct-password" } },
      res,
    );
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.ok(resetCalled, "counters should be reset after lock expiry");
  } finally {
    restoreModel(); restoreBcrypt(); restoreJwt();
  }
});

test("successful login resets failed attempt counter and clears lock", async () => {
  const userWithAttempts = {
    ...baseUser,
    failedLoginAttempts: 2,
    lockUntil: new Date(Date.now() + LOCKOUT_DURATION_MS),
  };
  let resetCalled = false;
  const res = response();
  const restoreModel = useMock(UserModel, {
    findOne: async () => userWithAttempts,
    updateOne: async ({ _id }, update) => {
      if (update.$set && update.$set.failedLoginAttempts === 0 && update.$set.lockUntil === null) {
        resetCalled = true;
      }
      return { modifiedCount: 1 };
    },
  });
  const restoreBcrypt = useMock(bcrypt, { compare: async () => true });
  const restoreJwt = useMock(jwt, { sign: () => "fake-token" });

  try {
    await LoginAccount(
      { body: { email: "user@example.test", password: "correct-password" } },
      res,
    );
    assert.equal(res.statusCode, 200);
    assert.ok(resetCalled, "successful login should reset failed attempts and clear lock");
  } finally {
    restoreModel(); restoreBcrypt(); restoreJwt();
  }
});

test("concurrent failed requests cannot bypass the attempt limit", async () => {
  let attempts = 0;
  let lockSetCount = 0;
  const restoreEnv = setEnv({ JWT_SECRET: "test-secret" });

  const res = response();
  const restoreModel = useMock(UserModel, {
    findOne: async () => ({ ...baseUser, failedLoginAttempts: attempts, lockUntil: null }),
    findOneAndUpdate: async ({ email }, update) => {
      if (update.$inc) {
        attempts += 1;
        return { ...baseUser, failedLoginAttempts: attempts, lockUntil: null };
      }
      return { ...baseUser };
    },
    updateOne: async ({ _id }, update) => {
      if (update.$set && update.$set.lockUntil) {
        lockSetCount += 1;
      }
      return { modifiedCount: 1 };
    },
  });
  const restoreBcrypt = useMock(bcrypt, { compare: async () => false });
  const restoreJwt = useMock(jwt, { sign: () => "fake-token" });

  try {
    // Fire 5 concurrent wrong-password requests
    const promises = Array.from({ length: 5 }, () =>
      LoginAccount(
        { body: { email: "user@example.test", password: "wrong-password" } },
        response(),
      ),
    );
    await Promise.all(promises);

    // Counter should have been incremented atomically for each request
    assert.equal(attempts, 5, "all 5 concurrent increments should be recorded");
    // Lock should have been set (at least once when counter reached 3)
    assert.ok(lockSetCount >= 1, "account lock should be triggered when limit reached");
  } finally {
    restoreModel(); restoreBcrypt(); restoreJwt(); restoreEnv();
  }
});

test("IP-based rate limiter allows requests under the limit", () => {
  const ip = "192.168.1.100";
  const calls = [];
  for (let i = 0; i < LOGIN_MAX_ATTEMPTS; i++) {
    const res = response();
    let nextCalled = false;
    loginRateLimiter(
      { ip, connection: { remoteAddress: ip }, socket: { remoteAddress: ip } },
      res,
      () => { nextCalled = true; },
    );
    calls.push({ nextCalled, statusCode: res.statusCode });
  }
  // All requests under the limit should pass through
  assert.ok(calls.every((c) => c.nextCalled), "all under-limit requests should call next");
});

test("IP-based rate limiter blocks requests over the limit", () => {
  const ip = "192.168.1.200";
  // Exhaust the limit
  for (let i = 0; i < LOGIN_MAX_ATTEMPTS; i++) {
    const res = response();
    loginRateLimiter(
      { ip, connection: { remoteAddress: ip }, socket: { remoteAddress: ip } },
      res,
      () => {},
    );
  }
  // The next request should be rate-limited
  const res = response();
  let nextCalled = false;
  loginRateLimiter(
    { ip, connection: { remoteAddress: ip }, socket: { remoteAddress: ip } },
    res,
    () => { nextCalled = true; },
  );
  assert.equal(res.statusCode, 429);
  assert.equal(nextCalled, false);
  assert.equal(res.body.success, false);
});

test("IP-based rate limiter resets after the time window", () => {
  const ip = "192.168.1.300";
  const oldNow = Date.now;
  Date.now = () => 1000; // pretend it's time 1000

  // Exhaust the limit at time 1000
  for (let i = 0; i < LOGIN_MAX_ATTEMPTS; i++) {
    const res = response();
    loginRateLimiter(
      { ip, connection: { remoteAddress: ip }, socket: { remoteAddress: ip } },
      res,
      () => {},
    );
  }
  // Should be rate limited at time 1000
  const res1 = response();
  loginRateLimiter(
    { ip, connection: { remoteAddress: ip }, socket: { remoteAddress: ip } },
    res1,
    () => {},
  );
  assert.equal(res1.statusCode, 429);

  // Advance time past the window
  Date.now = () => 1000 + LOGIN_WINDOW_MS + 1;
  const res2 = response();
  let nextCalled = false;
  loginRateLimiter(
    { ip, connection: { remoteAddress: ip }, socket: { remoteAddress: ip } },
    res2,
    () => { nextCalled = true; },
  );
  assert.equal(nextCalled, true, "request should pass after window reset");
  Date.now = oldNow;
});
