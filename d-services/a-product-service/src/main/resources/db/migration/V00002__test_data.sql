-- Test data for environment
INSERT INTO environment (id, name, description) VALUES
  ('ENV001', 'Development', 'Development environment'),
  ('ENV002', 'Testing', 'Testing environment');

-- Test data for tenant
INSERT INTO tenant (id, name, description) VALUES
  ('01JW4VXXGF3HZRJKJ3EKDHTEM4', 'Tenant A', 'Tenant A description'),
  ('01JW4VXXGFYBZPM3V3ERF0WHVQ', 'Tenant B', 'Tenant B description');

-- Test data for customer
INSERT INTO customer (environment_id, tenant_id, id, first_name, last_name, email, phone_number, address) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGFZVJ5X28QTBGFPWAY', 'Frodo', 'Baggins', 'frodo@shire.com', '1234567890', 'Bag End'),
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGGS3M0BZ6DKZDA2YF3', 'Samwise', 'Gamgee', 'sam@shire.com', '0987654321', 'Hobbiton');

-- Test data for category
INSERT INTO category (environment_id, tenant_id, id, name, description) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGGGKN8E2BHNG454QHH', 'Books', 'Books category'),
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGG3TWCP3V94DM4ABTA', 'Collectibles', 'Collectibles category');

-- Test data for product
INSERT INTO product (environment_id, tenant_id, id, category_id, name, description, rating, price) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGGZ0E4BH0PM29P0HFX', '01JW4VXXGGGKN8E2BHNG454QHH', 'The Hobbit', 'A fantasy novel', 4.8, 19.99),
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGGY379G19GE78ASXQS', '01JW4VXXGG3TWCP3V94DM4ABTA', 'One Ring Replica', 'A replica of the One Ring', 4.9, 99.99);

-- Test data for product_image
INSERT INTO product_image (environment_id, tenant_id, id, product_id, image_url) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGGEDHGXYT5DQ0JKT9V', '01JW4VXXGGZ0E4BH0PM29P0HFX', 'https://example.com/hobbit.jpg'),
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGG0HH051R5TKBSRPYF', '01JW4VXXGGY379G19GE78ASXQS', 'https://example.com/ring.jpg');

-- Test data for promotion
INSERT INTO promotion (environment_id, tenant_id, id, name, description, discount_percent, valid_from, valid_to) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGGFDSQ2Q13YAKJAF3B', 'Summer Sale', '10% off all items', 10.00, '2025-06-01T00:00:00Z', '2025-06-30T23:59:59Z');

-- Test data for inventory
INSERT INTO inventory (environment_id, tenant_id, product_id, stock_quantity, restock_threshold, last_restocked) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGGZ0E4BH0PM29P0HFX', 100, 10, '2025-05-01T10:00:00Z'),
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGGY379G19GE78ASXQS', 50, 5, '2025-05-02T11:00:00Z');


-- Test data for cart
INSERT INTO cart (environment_id, tenant_id, id, customer_id, status, created_at, updated_at) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGGF76BD80607FGXK8V', '01JW4VXXGFZVJ5X28QTBGFPWAY', 'ACTIVE', '2025-05-18T12:00:00Z', '2025-05-18T12:30:00Z');

-- Test data for cart_item
INSERT INTO cart_item (environment_id, tenant_id, id, cart_id, product_id, quantity, item_price) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGG4J94G9MRVH7NQMDN', '01JW4VXXGGF76BD80607FGXK8V', '01JW4VXXGGZ0E4BH0PM29P0HFX', 1, 19.99);

-- Test data for purchase_order
INSERT INTO purchase_order (environment_id, tenant_id, id, cart_id, customer_id, status, total_amount, created_at) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGGVH2MPPB5ESDEVQAX', '01JW4VXXGGF76BD80607FGXK8V', '01JW4VXXGFZVJ5X28QTBGFPWAY', 'COMPLETED', 19.99, '2025-05-18T13:00:00Z');

-- Test data for payment
INSERT INTO payment (environment_id, tenant_id, id, order_id, payment_method, payment_status, payment_date, amount) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGG5SQTVXM51NSZ13N0', '01JW4VXXGGVH2MPPB5ESDEVQAX', 'CREDIT_CARD', 'PAID', '2025-05-18T13:05:00Z', 19.99);

-- Test data for order_history
INSERT INTO order_history (environment_id, tenant_id, id, order_id, status, changed_at) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGG9HCAA1AK82Q8NX4V', '01JW4VXXGGVH2MPPB5ESDEVQAX', 'COMPLETED', '2025-05-18T13:10:00Z');

-- Test data for wishlist
INSERT INTO wishlist (environment_id, tenant_id, id, customer_id) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGGRYAJ9ENX6NMB1JQF', '01JW4VXXGFZVJ5X28QTBGFPWAY');

-- Test data for wishlist_item
INSERT INTO wishlist_item (environment_id, tenant_id, id, wishlist_id, product_id) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGGK15JZB19MDZ76Y6Z', '01JW4VXXGGRYAJ9ENX6NMB1JQF', '01JW4VXXGGZ0E4BH0PM29P0HFX');

-- Test data for review
INSERT INTO review (environment_id, tenant_id, id, product_id, customer_id, rating, comment, created_at) VALUES
  ('ENV001', '01JW4VXXGF3HZRJKJ3EKDHTEM4', '01JW4VXXGG7FQSY3E3HWAJMXZD', '01JW4VXXGGZ0E4BH0PM29P0HFX', '01JW4VXXGFZVJ5X28QTBGFPWAY', 5.0, 'Excellent product!', '2025-05-18T13:15:00Z');
