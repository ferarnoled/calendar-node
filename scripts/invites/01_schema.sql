CREATE TABLE base_table (
    created_user integer NOT NULL,
    created_timestamp timestamp with time zone NOT NULL,
    modified_user integer NULL,
    modified_timestamp timestamp with time zone NULL
);

CREATE SEQUENCE invites_invite_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
CREATE TABLE invites (
    invite_id integer PRIMARY KEY default(nextval('invites_invite_id_seq'::regclass)),
    invite_link text NOT NULL,
    case_id integer NOT NULL,
    inviter_user_id integer NOT NULL,
    is_pending bool NOT NULL,
    invitee_email text NULL,
    invitee_phone text NULL,
    relationship_id integer NOT NULL
) INHERITS (base_table);

ALTER SEQUENCE invites_invite_id_seq OWNED BY invites.invite_id;

CREATE INDEX ix_invites_invitee_email ON invites USING btree (invitee_email);
CREATE INDEX ix_invites_invitee_phone ON invites USING btree (invitee_phone);
