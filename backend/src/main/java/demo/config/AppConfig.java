package demo.config;

import demo.core.OtpService;
import demo.core.OtpStore;
import demo.core.TotpStore;
import demo.core.TotpService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;

@Configuration
public class AppConfig {
  @Bean
  OtpStore otpStore(@Value("${app.otp.ttl-seconds}") long ttl) {
    return new OtpStore(ttl);
  }

  @Bean
  OtpService otpService(OtpStore store, JavaMailSender sender) {
    return new OtpService(store, sender);
  }

  @Bean
  public TotpStore totpStore() {
    return new TotpStore();
  }

  @Bean
  public TotpService totpService(TotpStore s) {
    return new TotpService(s, "MailosaurDemo");
  }
}
