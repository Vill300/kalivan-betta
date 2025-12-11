import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://riuvtreidtjpsljekylm.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_CPV85eNI-cePBuhqR5xaKg_u3nvBXUE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
