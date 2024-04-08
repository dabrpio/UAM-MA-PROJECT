## Getting started

Create virtual environment: `python3 -m venv .venv`.

To activate the virtual environment, enter: `source .venv/bin/activate`.

> When you're finished with your virtual environment, enter the following command to deactivate it: `deactivate`.

Install a list of requirements specified in [requirements.txt](./requirements.txt):
`python -m pip install -r requirements.txt`.

Optionally install `@recommended` VSCode extensions.

Run the application: `uvicorn main:app --reload`.
