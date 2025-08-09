package demo.web;

import demo.core.OtpService;
import demo.web.dto.PasswordResponse;
import demo.web.dto.SendOtpRequest;
import demo.web.dto.VerifyOtpRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
public class OtpController {
  private final OtpService otp;
  private final Map<String, String> demoPwd = Map.of(
    "alice@demo.mailosaur.net", "alice-Password!23",
    "bob@demo.mailosaur.net", "bob-Password!23"
  );

  public OtpController(OtpService otp) { this.otp = otp; }

  @PostMapping("/send")
  public ResponseEntity<Void> send(@RequestBody @Valid SendOtpRequest req) {
    String code = otp.generate(req.email());
    otp.sendEmail(req.email(), code);
    return ResponseEntity.accepted().build();
  }

  @PostMapping("/verify")
  public ResponseEntity<PasswordResponse> verify(@RequestBody @Valid VerifyOtpRequest req) {
    if (!otp.verify(req.email(), req.code())) return ResponseEntity.badRequest().build();
    String pwd = demoPwd.getOrDefault(req.email(), "temporary-Password!23");
    return ResponseEntity.ok(new PasswordResponse(pwd));
  }
}
