--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.2
-- Dumped by pg_dump version 9.6.3

-- Started on 2017-07-12 18:06:33

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 8 (class 2615 OID 16401)
-- Name: cal; Type: SCHEMA; Schema: -; Owner: postgresadmin
--

CREATE SCHEMA cal;


ALTER SCHEMA cal OWNER TO postgresadmin;

--
-- TOC entry 1 (class 3079 OID 13308)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 3083 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = cal, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 186 (class 1259 OID 16484)
-- Name: event_types; Type: TABLE; Schema: cal; Owner: postgresadmin
--

CREATE TABLE event_types (
    event_type_id integer NOT NULL,
    name text NOT NULL,
    is_active boolean NOT NULL
);


ALTER TABLE event_types OWNER TO postgresadmin;

--
-- TOC entry 187 (class 1259 OID 16490)
-- Name: eventreminders_reminderid_seq; Type: SEQUENCE; Schema: cal; Owner: postgresadmin
--

CREATE SEQUENCE eventreminders_reminderid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE eventreminders_reminderid_seq OWNER TO postgresadmin;

--
-- TOC entry 188 (class 1259 OID 16492)
-- Name: events; Type: TABLE; Schema: cal; Owner: postgresadmin
--

CREATE TABLE events (
    event_id integer NOT NULL,
    name text NOT NULL,
    case_id integer NOT NULL,
    event_type_id integer NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    all_day boolean DEFAULT false NOT NULL,
    location_id bigint,
    notes text,
    transportation_id integer,
    time_zone_utc_offset text,
    ios_repeat_interval_id integer,
    ios_repeat_end_date timestamp with time zone,
    ios_reminder_id integer,
    ios_repeat_frequency_id integer
);


ALTER TABLE events OWNER TO postgresadmin;

--
-- TOC entry 189 (class 1259 OID 16499)
-- Name: events_eventid_seq; Type: SEQUENCE; Schema: cal; Owner: postgresadmin
--

CREATE SEQUENCE events_eventid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE events_eventid_seq OWNER TO postgresadmin;

--
-- TOC entry 3084 (class 0 OID 0)
-- Dependencies: 189
-- Name: events_eventid_seq; Type: SEQUENCE OWNED BY; Schema: cal; Owner: postgresadmin
--

ALTER SEQUENCE events_eventid_seq OWNED BY events.event_id;


--
-- TOC entry 193 (class 1259 OID 16547)
-- Name: events_types_event_type_id_seq; Type: SEQUENCE; Schema: cal; Owner: postgresadmin
--

CREATE SEQUENCE events_types_event_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE events_types_event_type_id_seq OWNER TO postgresadmin;

--
-- TOC entry 3085 (class 0 OID 0)
-- Dependencies: 193
-- Name: events_types_event_type_id_seq; Type: SEQUENCE OWNED BY; Schema: cal; Owner: postgresadmin
--

ALTER SEQUENCE events_types_event_type_id_seq OWNED BY event_types.event_type_id;


--
-- TOC entry 190 (class 1259 OID 16501)
-- Name: transportations; Type: TABLE; Schema: cal; Owner: postgresadmin
--

CREATE TABLE transportations (
    transportation_id integer NOT NULL,
    name text NOT NULL,
    is_active boolean NOT NULL
);


ALTER TABLE transportations OWNER TO postgresadmin;

SET search_path = public, pg_catalog;

--
-- TOC entry 191 (class 1259 OID 16507)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgresadmin
--

CREATE TABLE locations (
    location_id integer NOT NULL,
    street1 text,
    street2 text,
    city text,
    zip_code text,
    state text,
    country text,
    address text NOT NULL,
    name text NOT NULL,
    latitude numeric(10,7) NOT NULL,
    longitude numeric(10,7) NOT NULL,
    phone text
);


ALTER TABLE locations OWNER TO postgresadmin;

--
-- TOC entry 192 (class 1259 OID 16513)
-- Name: addresses_addressid_seq; Type: SEQUENCE; Schema: public; Owner: postgresadmin
--

CREATE SEQUENCE addresses_addressid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE addresses_addressid_seq OWNER TO postgresadmin;

--
-- TOC entry 3086 (class 0 OID 0)
-- Dependencies: 192
-- Name: addresses_addressid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgresadmin
--

ALTER SEQUENCE addresses_addressid_seq OWNED BY locations.location_id;


SET search_path = cal, pg_catalog;

--
-- TOC entry 2943 (class 2604 OID 16549)
-- Name: event_types event_type_id; Type: DEFAULT; Schema: cal; Owner: postgresadmin
--

ALTER TABLE ONLY event_types ALTER COLUMN event_type_id SET DEFAULT nextval('events_types_event_type_id_seq'::regclass);


--
-- TOC entry 2945 (class 2604 OID 16550)
-- Name: events event_id; Type: DEFAULT; Schema: cal; Owner: postgresadmin
--

ALTER TABLE ONLY events ALTER COLUMN event_id SET DEFAULT nextval('events_eventid_seq'::regclass);


SET search_path = public, pg_catalog;

--
-- TOC entry 2946 (class 2604 OID 16567)
-- Name: locations location_id; Type: DEFAULT; Schema: public; Owner: postgresadmin
--

ALTER TABLE ONLY locations ALTER COLUMN location_id SET DEFAULT nextval('addresses_addressid_seq'::regclass);


SET search_path = cal, pg_catalog;

--
-- TOC entry 2950 (class 2606 OID 16552)
-- Name: events pk_events; Type: CONSTRAINT; Schema: cal; Owner: postgresadmin
--

ALTER TABLE ONLY events
    ADD CONSTRAINT pk_events PRIMARY KEY (event_id);


--
-- TOC entry 2948 (class 2606 OID 16520)
-- Name: event_types pk_eventtypes; Type: CONSTRAINT; Schema: cal; Owner: postgresadmin
--

ALTER TABLE ONLY event_types
    ADD CONSTRAINT pk_eventtypes PRIMARY KEY (event_type_id);


--
-- TOC entry 2952 (class 2606 OID 16522)
-- Name: transportations pk_transportations; Type: CONSTRAINT; Schema: cal; Owner: postgresadmin
--

ALTER TABLE ONLY transportations
    ADD CONSTRAINT pk_transportations PRIMARY KEY (transportation_id);


SET search_path = public, pg_catalog;

--
-- TOC entry 2955 (class 2606 OID 16569)
-- Name: locations pk_locations; Type: CONSTRAINT; Schema: public; Owner: postgresadmin
--

ALTER TABLE ONLY locations
    ADD CONSTRAINT pk_locations PRIMARY KEY (location_id);


--
-- TOC entry 2953 (class 1259 OID 16525)
-- Name: ix_locations_name_lat_lon; Type: INDEX; Schema: public; Owner: postgresadmin
--

CREATE UNIQUE INDEX ix_locations_name_lat_lon ON locations USING btree (name, latitude, longitude);


SET search_path = cal, pg_catalog;

--
-- TOC entry 2956 (class 2606 OID 16526)
-- Name: events fk_events_eventtypes; Type: FK CONSTRAINT; Schema: cal; Owner: postgresadmin
--

ALTER TABLE ONLY events
    ADD CONSTRAINT fk_events_eventtypes FOREIGN KEY (event_type_id) REFERENCES event_types(event_type_id);


--
-- TOC entry 2958 (class 2606 OID 16570)
-- Name: events fk_events_locations; Type: FK CONSTRAINT; Schema: cal; Owner: postgresadmin
--

ALTER TABLE ONLY events
    ADD CONSTRAINT fk_events_locations FOREIGN KEY (location_id) REFERENCES public.locations(location_id);


--
-- TOC entry 2957 (class 2606 OID 16536)
-- Name: events fk_events_transportations; Type: FK CONSTRAINT; Schema: cal; Owner: postgresadmin
--

ALTER TABLE ONLY events
    ADD CONSTRAINT fk_events_transportations FOREIGN KEY (transportation_id) REFERENCES transportations(transportation_id);


--
-- TOC entry 3082 (class 0 OID 0)
-- Dependencies: 3
-- Name: public; Type: ACL; Schema: -; Owner: postgresadmin
--

REVOKE ALL ON SCHEMA public FROM rdsadmin;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO postgresadmin;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2017-07-12 18:06:47

--
-- PostgreSQL database dump complete
--

