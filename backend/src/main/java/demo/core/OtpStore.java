package demo.core;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class OtpStore {
  private final Map<String, Entry> store = new ConcurrentHashMap<>();
  private final long ttlSeconds;

  public OtpStore(long ttlSeconds) {
    this.ttlSeconds = ttlSeconds;
  }

  public void save(String email, String code) {
    store.put(email, new Entry(code, Instant.now().plusSeconds(ttlSeconds)));
  }

  public boolean verify(String email, String code) {
    Entry e = store.get(email);
    if (e == null || Instant.now().isAfter(e.expireAt)) {
      return false;
    }
    return e.code.equals(code);
  }

  public void clearExpired() {
    store.entrySet().removeIf(kv -> Instant.now().isAfter(kv.getValue().expireAt));
  }

  private record Entry(String code, Instant expireAt) {
  }
}
