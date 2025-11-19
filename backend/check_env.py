from dotenv import dotenv_values

config = dotenv_values('.env')
print('Loaded from .env file:')
for k, v in config.items():
    if 'DB_' in k:
        print(f'  {k}={v}')
