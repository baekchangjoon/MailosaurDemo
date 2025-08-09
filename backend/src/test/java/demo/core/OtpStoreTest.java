package demo.core;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OtpStoreTest {
  @Test void saveAndVerifyWithinTtl() {
    OtpStore s = new OtpStore(5);
    s.save("a@b.c", "123456");
    assertTrue(s.verify("a@b.c", "123456"));
  }

  @Test void rejectWrongCodeOrMissing() {
    OtpStore s = new OtpStore(5);
    s.save("a@b.c", "123456");
    assertFalse(s.verify("a@b.c", "999999"));
    assertFalse(s.verify("x@y.z", "123456"));
  }
}
