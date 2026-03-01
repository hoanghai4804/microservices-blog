def test_imports():
    import fastapi  # noqa: F401
    import sqlalchemy  # noqa: F401
    import redis  # noqa: F401
    import pydantic  # noqa: F401

    assert True


def test_python_version():
    import sys

    assert sys.version_info >= (3, 10)


def test_pydantic_v2():
    import pydantic

    assert int(pydantic.__version__.split(".")[0]) == 2
