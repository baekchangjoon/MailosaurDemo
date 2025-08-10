package demo.web;

import demo.core.TotpService;
import jakarta.validation.constraints.Email;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

record EnrollReq(@Email String email) {}
record EnrollRes(String secret, String otpauthUri) {}
record TotpReq(@Email String email, String code) {}

@RestController
@RequestMapping("/api/totp")
public class TotpController {
  private final TotpService svc;

  public TotpController(TotpService svc) {
    this.svc = svc;
  }

  @PostMapping("/enroll")
  public ResponseEntity<EnrollRes> enroll(@RequestBody EnrollReq r) throws Exception {
    String s = svc.generateSecret(r.email());
    return ResponseEntity.ok(new EnrollRes(s, svc.otpauthUri(r.email(), s)));
  }

  @PostMapping("/confirm")
  public ResponseEntity<Void> confirm(@RequestBody TotpReq r) throws Exception {
    return svc.verify(r.email(), r.code()) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
  }

  @PostMapping("/verify")
  public ResponseEntity<Void> verify(@RequestBody TotpReq r) throws Exception {
    return svc.verify(r.email(), r.code()) ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
  }
}
