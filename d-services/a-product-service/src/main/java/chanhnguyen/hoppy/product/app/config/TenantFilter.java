package chanhnguyen.hoppy.product.app.config;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;

import chanhnguyen.hoppy.product.model.valueobject.TenantId;


@Component
public class TenantFilter implements Filter {
	private static final String TENANT_HEADER = "x-tenant-id";
	@Override
	public void doFilter(ServletRequest servletRequest,
						 ServletResponse servletResponse,
						 FilterChain filterChain) throws IOException, ServletException {
		try {
			if (servletRequest instanceof HttpServletRequest) {
				HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;
				String tenant = httpRequest.getHeader(TENANT_HEADER);
				if (!StringUtils.isEmpty(tenant)) {
					Tenant.setTenantId(TenantId.of(tenant));
				}
				MDC.put("tenant", tenant);
			} else {
				Tenant.setTenantId(null);
				MDC.put("tenant", null);
			}

			filterChain.doFilter(servletRequest, servletResponse);
		} finally {
			Tenant.clear();
			MDC.clear();
		}
	}
}
