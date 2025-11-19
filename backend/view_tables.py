#!/usr/bin/env python
"""View all tables and their row counts in the database"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_core.settings')
import django
django.setup()

from django.db import connection

print("=" * 80)
print("DATABASE TABLES")
print("=" * 80)

with connection.cursor() as cursor:
    # Get all tables
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
    """)
    
    tables = cursor.fetchall()
    
    print(f"\nFound {len(tables)} tables:\n")
    
    for (table_name,) in tables:
        # Get row count for each table
        cursor.execute(f'SELECT COUNT(*) FROM "{table_name}"')
        count = cursor.fetchone()[0]
        print(f"  📊 {table_name:<50} ({count:>6} rows)")

print("\n" + "=" * 80)
