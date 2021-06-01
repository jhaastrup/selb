/**
 * Auth.js export. This nicely wraps up all features around authentication into a single module
 */

import * as actions from "./actions";
import redirect from "./redirect";
import * as session from "./session";

const Auth = { redirect, ...session, ...actions };

export default Auth;