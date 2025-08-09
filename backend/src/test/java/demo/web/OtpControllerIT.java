package demo.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import demo.web.dto.SendOtpRequest;
import demo.web.dto.VerifyOtpRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class OtpControllerIT {
  @Autowired MockMvc mvc;
  @Autowired JavaMailSender sender;
  @Autowired ObjectMapper om;

  @Test void sendAndVerifyFlow() throws Exception {
    doNothing().when(sender).send(any(SimpleMailMessage.class));
    mvc.perform(post("/api/otp/send")
      .contentType("application/json")
      .content(om.writeValueAsString(new SendOtpRequest("t@e.st"))))
      .andExpect(status().isAccepted());

    mvc.perform(post("/api/otp/verify")
      .contentType("application/json")
      .content(om.writeValueAsString(new VerifyOtpRequest("t@e.st", "000000"))))
      .andExpect(status().isBadRequest());
  }
}
