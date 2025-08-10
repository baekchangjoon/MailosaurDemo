package demo.core;

import com.eatthepath.otp.TimeBasedOneTimePasswordGenerator;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

public class TotpService {
  private final TotpStore store;
  private final String issuer;

  public TotpService(TotpStore store, String issuer) {
    this.store = store;
    this.issuer = issuer;
  }

  public String generateSecret(String email) throws Exception {
    KeyGenerator kg = KeyGenerator.getInstance("HmacSHA1");
    kg.init(160);
    SecretKey key = kg.generateKey();
    String secret = Base64.getEncoder().encodeToString(key.getEncoded());
    store.save(email, secret);
    return secret;
  }

  public String otpauthUri(String email, String secret) {
    String i = enc(issuer);
    String a = enc(email);
    String s = enc(secret);
    return "otpauth://totp/" + i + ":" + a + "?secret=" + s + "&issuer=" + i + "&period=30&digits=6";
  }

  public boolean verify(String email, String code) throws Exception {
    String secret = store.get(email);
    if (secret == null) return false;
    TimeBasedOneTimePasswordGenerator g = new TimeBasedOneTimePasswordGenerator(Duration.ofSeconds(30));
    Key key = new SecretKeySpec(Base64.getDecoder().decode(secret), "HmacSHA1");
    Instant now = Instant.now();
    int c = Integer.parseInt(code);
    return gen(g, key, now.minusSeconds(30)) == c
        || gen(g, key, now) == c
        || gen(g, key, now.plusSeconds(30)) == c;
  }

  private static int gen(TimeBasedOneTimePasswordGenerator g, Key k, Instant t) throws Exception {
    return g.generateOneTimePassword(k, t);
  }

  private static String enc(String v) {
    return URLEncoder.encode(v, StandardCharsets.UTF_8);
  }
}
