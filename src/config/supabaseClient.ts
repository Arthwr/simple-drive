import { createClient } from '@supabase/supabase-js';

import config from '.';

const supabase = createClient(config.supabase_url, config.supabase_private_key);

export default supabase;
