package demo.core;

import org.junit.jupiter.api.Test;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OtpServiceTest {
  @Test void generateAndSend() {
    JavaMailSender sender = mock(JavaMailSender.class);
    OtpService svc = new OtpService(new OtpStore(300), sender);
    String code = svc.generate("t@e.st");
    assertEquals(6, code.length());
    doNothing().when(sender).send(any(SimpleMailMessage.class));
    svc.sendEmail("t@e.st", code);
    verify(sender, times(1)).send(any(SimpleMailMessage.class));
  }
}
