UPDATE auth.users
SET encrypted_password = crypt('12345678', gen_salt('bf')),
    updated_at = now()
WHERE email = 'healingbudsglobal@gmail.com';