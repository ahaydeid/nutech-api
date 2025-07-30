-- =============================================
-- SCHEMA SQL: Struktur Tabel untuk Aplikasi
-- =============================================

-- =============================================
-- Table: public.users
-- =============================================

CREATE TABLE IF NOT EXISTS public.users (
    id             INTEGER NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    email          VARCHAR(100) NOT NULL,
    first_name     VARCHAR(50)  NOT NULL,
    last_name      VARCHAR(50)  NOT NULL,
    password       TEXT         NOT NULL,
    balance        INTEGER      DEFAULT 0,
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    profile_image  TEXT,
    CONSTRAINT users_pkey      PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

ALTER TABLE IF EXISTS public.users
    OWNER TO postgres;

-- =============================================
-- Table: public.services
-- =============================================

CREATE TABLE IF NOT EXISTS public.services (
    id             INTEGER NOT NULL DEFAULT nextval('services_id_seq'::regclass),
    service_code   TEXT    NOT NULL,
    service_name   TEXT    NOT NULL,
    service_icon   TEXT    NOT NULL,
    service_tariff INTEGER NOT NULL,
    CONSTRAINT services_pkey PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.services
    OWNER TO postgres;

-- =============================================
-- Table: public.banners
-- =============================================

CREATE TABLE IF NOT EXISTS public.banners (
    id            INTEGER NOT NULL DEFAULT nextval('banners_id_seq'::regclass),
    banner_name   TEXT    NOT NULL,
    banner_image  TEXT    NOT NULL,
    description   TEXT,
    CONSTRAINT banners_pkey PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.banners
    OWNER TO postgres;

-- =============================================
-- Table: public.transactions
-- =============================================

CREATE TABLE IF NOT EXISTS public.transactions (
    id                INTEGER NOT NULL DEFAULT nextval('transactions_id_seq'::regclass),
    user_id           INTEGER,
    invoice_number    VARCHAR(50)  NOT NULL,
    transaction_type  VARCHAR(20),
    description       TEXT,
    total_amount      INTEGER,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT transactions_pkey     PRIMARY KEY (id),
    CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

ALTER TABLE IF EXISTS public.transactions
    OWNER TO postgres;
