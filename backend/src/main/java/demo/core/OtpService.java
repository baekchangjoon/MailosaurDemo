package demo.core;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.security.SecureRandom;

public class OtpService {
  private final OtpStore store;
  private final JavaMailSender mailSender;
  private final SecureRandom random = new SecureRandom();

  public OtpService(OtpStore store, JavaMailSender mailSender) {
    this.store = store;
    this.mailSender = mailSender;
  }

  public String generate(String email) {
    String code = String.format("%06d", random.nextInt(1_000_000));
    store.save(email, code);
    return code;
  }

  public boolean verify(String email, String code) {
    return store.verify(email, code);
  }

  public void sendEmail(String to, String code) {
    SimpleMailMessage m = new SimpleMailMessage();
    m.setTo(to);
    m.setSubject("[Demo] Your OTP Code");
    m.setText("Your OTP is: " + code);
    mailSender.send(m);
  }
}
