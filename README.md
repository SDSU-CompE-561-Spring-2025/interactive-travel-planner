![image](https://github.com/user-attachments/assets/bb7e17a2-2879-45be-b20c-bf4648c69dd5)

# WAYMARK
## Interactive Travel Planner

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->


## 🚀 Features

- FastAPI backend with modular project structure  
- SQLAlchemy ORM for database interaction  
- Pydantic for data validation and serialization  
- JWT-based user authentication  
- Organized routing and dependency injection  
- Middleware for CORS and logging  
- Unit testing with `pytest`



---

## 🛠️ Setup Instructions


### 1. Clone the repository
```bash
git clone [https://github.com/yourusername/your_project_name.git](https://github.com/SDSU-CompE-561-Spring-2025/interactive-travel-planner/)
cd interactive-travel-planner
```

### 2. Set up the Virtual Envoronment
```bash
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

### 3. install dependencies
```bash
pip install -r requirements.txt
```

### 4. Installing the app
```bash
uvicorn app.main:app --reload
or
hatch run dev
```


[![PyPI - Version](https://img.shields.io/pypi/v/interactive-travel-planner.svg)](https://pypi.org/project/interactive-travel-planner)
[![PyPI - Python Version](https://img.shields.io/pypi/pyversions/interactive-travel-planner.svg)](https://pypi.org/project/interactive-travel-planner)

-----

## Table of Contents

- [Installation](#installation)
- [License](#license)

## Installation

```console
pip install interactive-travel-planner
```

## License

`interactive-travel-planner` is distributed under the terms of the [MIT](https://spdx.org/licenses/MIT.html) license.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
