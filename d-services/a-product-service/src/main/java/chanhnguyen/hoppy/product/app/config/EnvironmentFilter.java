package chanhnguyen.hoppy.product.app.config;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.MDC;
import org.springframework.stereotype.Component;

@Component
public class EnvironmentFilter implements Filter {
	private static final String ENVIRONMENT_HEADER = "x-environment-id";

	@Override
	public void doFilter(ServletRequest request,
						 ServletResponse response,
						 FilterChain chain) throws IOException, ServletException {
	try {
			if (request instanceof HttpServletRequest) {
				HttpServletRequest httpRequest = (HttpServletRequest) request;
				String environment = httpRequest.getHeader(ENVIRONMENT_HEADER);
				Environment.setEnvironmentId(environment);
				MDC.put("environment", environment);
			} else {
				Environment.setEnvironmentId(null);
				MDC.put("environment", null);
			}

			chain.doFilter(request, response);
		} finally {
			MDC.clear();
			Environment.clear();
		}
	}
}
