import {createBrowserClient} from '@supabase/ssr'

export const supabase = createBrowserClient(
    process.env.NEXT_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_PUBLISHABLE_KEY!
)
