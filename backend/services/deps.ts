// we need this to be able to stub functions in our tests :(

import { parseOfficeAsync } from "@officeparser";

export const officeparser = { parseOfficeAsync };

import { crypto as _crypto } from "@std/crypto";

export const crypto = { ..._crypto };
