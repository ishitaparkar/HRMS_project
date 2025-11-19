#!/usr/bin/env python
"""Test NeonDB connection"""
import os
import sys
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

# Load environment variables
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / '.env')

print("=" * 70)
print("Environment Variables Check")
print("=" * 70)
print(f"DB_HOST: {os.getenv('DB_HOST')}")
print(f"DB_NAME: {os.getenv('DB_NAME')}")
print(f"DB_USER: {os.getenv('DB_USER')}")
print(f"DB_PORT: {os.getenv('DB_PORT')}")
print()

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hrms_core.settings')
import django
django.setup()

from django.conf import settings
from django.db import connection

print("=" * 70)
print("Django Database Configuration")
print("=" * 70)
db_config = settings.DATABASES['default']
print(f"Engine: {db_config['ENGINE']}")
print(f"Host: {db_config['HOST']}")
print(f"Name: {db_config['NAME']}")
print(f"User: {db_config['USER']}")
print(f"Port: {db_config['PORT']}")
print(f"SSL Options: {db_config.get('OPTIONS', {})}")
print()

print("=" * 70)
print("Testing Database Connection")
print("=" * 70)
try:
    cursor = connection.cursor()
    cursor.execute('SELECT version()')
    version = cursor.fetchone()[0]
    print(f"✓ Successfully connected to database!")
    print(f"  PostgreSQL version: {version[:100]}")
    
    # Check if it's NeonDB
    if 'neon' in version.lower() or 'neon.tech' in db_config['HOST']:
        print(f"\n✓ Connected to NeonDB cloud database!")
    else:
        print(f"\n⚠️  Connected to local PostgreSQL, not NeonDB")
        
except Exception as e:
    print(f"✗ Connection failed: {e}")
    sys.exit(1)

print("=" * 70)
