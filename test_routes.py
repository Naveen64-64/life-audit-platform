from app import app

client = app.test_client()

print('=== TESTING ROUTES ===\n')

tests = [
    ('/', 200, 'Home'),
    ('/profile', 302, 'Profile (redirect to login)'),
    ('/add-activity', 302, 'Add Activity (redirect to login)'),
    ('/analytics', 302, 'Analytics (redirect to login)'),
    ('/dashboard', 302, 'Dashboard (redirect to login)'),
    ('/login', 200, 'Login'),
    ('/signup', 200, 'Signup'),
]

passed = 0
for route, expected_status, desc in tests:
    resp = client.get(route)
    status = 'PASS' if resp.status_code == expected_status else 'FAIL'
    symbol = '✓' if status == 'PASS' else '✗'
    print(f'{symbol} {desc:45} : {resp.status_code} (expected {expected_status})')
    if status == 'PASS':
        passed += 1

print(f'\n=== RESULTS: {passed}/{len(tests)} TESTS PASSED ===')
if passed == len(tests):
    print('✓ All routes working correctly!')
