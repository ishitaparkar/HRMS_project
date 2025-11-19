#!/usr/bin/env python
"""Debug script to verify Neon connection and show database info"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_core.settings')
import django
django.setup()

from django.db import connection
from django.conf import settings

print("=" * 80)
print("NEON DATABASE CONNECTION INFO")
print("=" * 80)

db_config = settings.DATABASES['default']
print(f"\n📍 Connection Details:")
print(f"   Host: {db_config['HOST']}")
print(f"   Database: {db_config['NAME']}")
print(f"   User: {db_config['USER']}")
print(f"   Port: {db_config['PORT']}")

print("\n" + "=" * 80)
print("VERIFYING CONNECTION")
print("=" * 80)

with connection.cursor() as cursor:
    # Get current database
    cursor.execute("SELECT current_database();")
    current_db = cursor.fetchone()[0]
    print(f"\n✓ Connected to database: {current_db}")
    
    # Get PostgreSQL version
    cursor.execute("SELECT version();")
    version = cursor.fetchone()[0]
    print(f"✓ PostgreSQL version: {version[:80]}")
    
    # Get current schema
    cursor.execute("SELECT current_schema();")
    schema = cursor.fetchone()[0]
    print(f"✓ Current schema: {schema}")
    
    print("\n" + "=" * 80)
    print("TABLES IN DATABASE")
    print("=" * 80)
    
    # List all tables in public schema
    cursor.execute("""
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename;
    """)
    
    tables = cursor.fetchall()
    
    if tables:
        print(f"\n✓ Found {len(tables)} tables in 'public' schema:\n")
        for schema, table in tables:
            cursor.execute(f'SELECT COUNT(*) FROM "{table}"')
            count = cursor.fetchone()[0]
            print(f"   • {table:<50} ({count} rows)")
    else:
        print("\n⚠️  No tables found in 'public' schema!")
        print("\nThis could mean:")
        print("  1. Migrations haven't been run")
        print("  2. You're looking at a different database in Neon console")
        print("  3. Tables are in a different schema")
    
    # Check all schemas
    print("\n" + "=" * 80)
    print("ALL SCHEMAS IN DATABASE")
    print("=" * 80)
    
    cursor.execute("""
        SELECT schema_name 
        FROM information_schema.schemata 
        ORDER BY schema_name;
    """)
    
    schemas = cursor.fetchall()
    print(f"\nAvailable schemas:")
    for (schema,) in schemas:
        cursor.execute(f"""
            SELECT COUNT(*) 
            FROM information_schema.tables 
            WHERE table_schema = '{schema}';
        """)
        table_count = cursor.fetchone()[0]
        print(f"   • {schema:<30} ({table_count} tables)")

print("\n" + "=" * 80)
print("INSTRUCTIONS FOR NEON CONSOLE")
print("=" * 80)
print("""
To view tables in Neon Console:

1. Go to: https://console.neon.tech/
2. Select your project
3. Make sure you're viewing the correct:
   - Branch: (usually 'main')
   - Database: 'neondb' (shown above)
4. Click on "Tables" in the left sidebar
5. Or use "SQL Editor" and run: SELECT * FROM pg_tables WHERE schemaname = 'public';

If you still don't see tables, they might not have been created yet.
Run: python manage.py migrate
""")

print("=" * 80)
