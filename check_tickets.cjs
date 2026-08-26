const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({path: '.env'}); // maybe .env doesn't exist, we can use VITE_ variables by getting them from process.env if they exist, but wait we didn't have .env!
