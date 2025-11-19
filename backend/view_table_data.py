#!/usr/bin/env python
"""View data from specific tables"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_core.settings')
import django
django.setup()

from django.db import connection
from tabulate import tabulate

def view_table(table_name, limit=10):
    """View data from a specific table"""
    with connection.cursor() as cursor:
        # Get column names
        cursor.execute(f"""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = '{table_name}'
            ORDER BY ordinal_position;
        """)
        columns = [row[0] for row in cursor.fetchall()]
        
        # Get data
        cursor.execute(f'SELECT * FROM "{table_name}" LIMIT {limit}')
        rows = cursor.fetchall()
        
        print(f"\n{'='*80}")
        print(f"TABLE: {table_name}")
        print(f"{'='*80}")
        
        if rows:
            print(tabulate(rows, headers=columns, tablefmt='grid'))
        else:
            print("(No data)")
        
        # Get total count
        cursor.execute(f'SELECT COUNT(*) FROM "{table_name}"')
        total = cursor.fetchone()[0]
        print(f"\nTotal rows: {total}")

if __name__ == '__main__':
    # View key tables
    tables_to_view = [
        'employee_management_employee',
        'auth_user',
        'authentication_userprofile',
        'leave_management_leaverequest',
        'auth_group',
    ]
    
    for table in tables_to_view:
        try:
            view_table(table)
        except Exception as e:
            print(f"Error viewing {table}: {e}")
