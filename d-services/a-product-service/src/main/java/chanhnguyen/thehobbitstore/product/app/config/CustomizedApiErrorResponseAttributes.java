package chanhnguyen.thehobbitstore.product.app.config;

import java.util.Map;
import java.util.UUID;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.WebRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
//@Component
public class CustomizedApiErrorResponseAttributes extends DefaultErrorAttributes {

    @Override
    public Map<String, Object> getErrorAttributes(WebRequest webRequest, ErrorAttributeOptions options) {
        Map<String, Object> errorAttributes =
                super.getErrorAttributes(webRequest, options);
        errorAttributes.put("locale", webRequest.getLocale().toString());
        errorAttributes.put("the_hobbit_store_trace_id", UUID.randomUUID());

        return errorAttributes;
    }
}
