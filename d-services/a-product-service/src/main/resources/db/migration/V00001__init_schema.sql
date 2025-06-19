-- PostgreSQL Domain Types
CREATE DOMAIN ulid AS VARCHAR(26)
    CONSTRAINT ulid_26_chars_length_and_uppercase_check
    CHECK (UPPER(VALUE) = VALUE AND LENGTH(VALUE) = 26);

CREATE DOMAIN env_id AS VARCHAR(10)
    CONSTRAINT env_id_10_chars_length_and_uppercase_check
    CHECK (UPPER(VALUE) = VALUE AND LENGTH(VALUE) >= 5 AND LENGTH(VALUE) <= 10);

-- Environment Table
CREATE TABLE environment (
    id env_id PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

-- Tenant Table
CREATE TABLE tenant (
    id ulid PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

-- Customer Table
CREATE TABLE customer (
    environment_id env_id,
    tenant_id ulid,
    id ulid,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    address VARCHAR(255),
    PRIMARY KEY (id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- Category Table
CREATE TABLE category (
    environment_id env_id,
    tenant_id ulid,
    id ulid,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- Product Table
CREATE TABLE product (
    environment_id env_id,
    tenant_id ulid,
    id ulid,
    category_id ulid,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    rating NUMERIC(2,1),
    price NUMERIC(12,2) NOT NULL,
    PRIMARY KEY (id, environment_id, tenant_id),
    FOREIGN KEY (category_id, environment_id, tenant_id) REFERENCES category(id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- Product Image Table
CREATE TABLE product_image (
    environment_id env_id,
    tenant_id ulid,
    id ulid,
    product_id ulid,
    image_url VARCHAR(255) NOT NULL,
    PRIMARY KEY (id, environment_id, tenant_id),
    FOREIGN KEY (product_id, environment_id, tenant_id) REFERENCES product(id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- Inventory Table
CREATE TABLE inventory (
    environment_id env_id,
    tenant_id ulid,
    product_id ulid,
    stock_quantity INTEGER NOT NULL,
    restock_threshold INTEGER,
    last_restocked TIMESTAMP,
    PRIMARY KEY (environment_id, tenant_id, product_id),
    FOREIGN KEY (product_id, environment_id, tenant_id) REFERENCES product(id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- Cart Table
CREATE TABLE cart (
    environment_id env_id,
    tenant_id ulid,
    id ulid,
    customer_id ulid,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, environment_id, tenant_id),
    FOREIGN KEY (customer_id, environment_id, tenant_id) REFERENCES customer(id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- Cart Item Table
CREATE TABLE cart_item (
    environment_id env_id,
    tenant_id ulid,
    id ulid,
    cart_id ulid,
    product_id ulid,
    quantity INTEGER NOT NULL,
    item_price NUMERIC(12,2) NOT NULL,
    PRIMARY KEY (id, environment_id, tenant_id),
    FOREIGN KEY (cart_id, environment_id, tenant_id) REFERENCES cart(id, environment_id, tenant_id),
    FOREIGN KEY (product_id, environment_id, tenant_id) REFERENCES product(id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- Promotion Table
CREATE TABLE promotion (
    environment_id env_id,
    tenant_id ulid,
    id ulid,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    discount_percent NUMERIC(5,2),
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    PRIMARY KEY (id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- Purchase Order Table
CREATE TABLE purchase_order (
    environment_id env_id,
    tenant_id ulid,
    id ulid,
    cart_id ulid,
    customer_id ulid,
    status VARCHAR(20) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, environment_id, tenant_id),
    FOREIGN KEY (cart_id, environment_id, tenant_id) REFERENCES cart(id, environment_id, tenant_id),
    FOREIGN KEY (customer_id, environment_id, tenant_id) REFERENCES customer(id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- Payment Table
CREATE TABLE payment (
    environment_id env_id,
    tenant_id ulid,
    id ulid,
    order_id ulid,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount NUMERIC(12,2) NOT NULL,
    PRIMARY KEY (id, environment_id, tenant_id),
    FOREIGN KEY (order_id, environment_id, tenant_id) REFERENCES purchase_order(id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- Order History Table
CREATE TABLE order_history (
    environment_id env_id,
    tenant_id ulid,
    id ulid,
    order_id ulid,
    status VARCHAR(20) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, environment_id, tenant_id),
    FOREIGN KEY (order_id, environment_id, tenant_id) REFERENCES purchase_order(id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- Wishlist Table
CREATE TABLE wishlist (
    environment_id env_id,
    tenant_id ulid,
    id ulid,
    customer_id ulid,
    PRIMARY KEY (id, environment_id, tenant_id),
    FOREIGN KEY (customer_id, environment_id, tenant_id) REFERENCES customer(id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- Wishlist Item Table
CREATE TABLE wishlist_item (
    environment_id env_id,
    tenant_id ulid,
    id ulid,
    wishlist_id ulid,
    product_id ulid,
    PRIMARY KEY (id, environment_id, tenant_id),
    FOREIGN KEY (wishlist_id, environment_id, tenant_id) REFERENCES wishlist(id, environment_id, tenant_id),
    FOREIGN KEY (product_id, environment_id, tenant_id) REFERENCES product(id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);

-- Review Table
CREATE TABLE review (
    environment_id env_id,
    tenant_id ulid,
    id ulid,
    product_id ulid,
    customer_id ulid,
    rating NUMERIC(2,1) NOT NULL,
    comment VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, environment_id, tenant_id),
    FOREIGN KEY (product_id, environment_id, tenant_id) REFERENCES product(id, environment_id, tenant_id),
    FOREIGN KEY (customer_id, environment_id, tenant_id) REFERENCES customer(id, environment_id, tenant_id),
    FOREIGN KEY (environment_id) REFERENCES environment(id),
    FOREIGN KEY (tenant_id) REFERENCES tenant(id)
);
