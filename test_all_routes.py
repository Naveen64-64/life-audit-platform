from app import app

client = app.test_client()

print('=== COMPREHENSIVE ROUTE TEST ===\n')

tests = [
    ('/', 200, 'Home'),
    ('/profile', 302, 'Profile (redirect)'),
    ('/add-activity', 302, 'Add Activity (redirect)'),
    ('/analytics', 302, 'Analytics (redirect)'),
    ('/dashboard', 302, 'Dashboard (redirect)'),
    ('/goals', 302, 'Goals (redirect)'),
    ('/activities', 302, 'Activities (redirect)'),
    ('/suggestions', 302, 'Suggestions (redirect)'),
    ('/login', 200, 'Login'),
    ('/signup', 200, 'Signup'),
]

passed = 0
failed = []

for route, expected_status, desc in tests:
    try:
        resp = client.get(route)
        status = 'PASS' if resp.status_code == expected_status else 'FAIL'
        symbol = '✓' if status == 'PASS' else '✗'
        print(f'{symbol} {desc:45} : {resp.status_code} (expected {expected_status})')
        if status == 'PASS':
            passed += 1
        else:
            failed.append(f"{desc} returned {resp.status_code} instead of {expected_status}")
    except Exception as e:
        print(f'✗ {desc:45} : ERROR - {str(e)[:50]}')
        failed.append(f"{desc} raised {type(e).__name__}")

print(f'\n=== RESULTS: {passed}/{len(tests)} ROUTES PASSED ===')

if failed:
    print('\n❌ FAILURES:')
    for f in failed:
        print(f'  - {f}')
else:
    print('✓ All routes working correctly!')
    print('\n✓ No 500 errors detected')
