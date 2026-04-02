-- Check existing users in database
SELECT id, username, email, full_name, city, created_at 
FROM users 
ORDER BY created_at DESC;
