package demo.core;

import java.util.concurrent.ConcurrentHashMap;

public class TotpStore {
  private final ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>();
  public void save(String email, String secret) { map.put(email, secret); }
  public String get(String email) { return map.get(email); }
  public boolean exists(String email) { return map.containsKey(email); }
}
