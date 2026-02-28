def test_imports():
    import fastapi, sqlalchemy, redis, pydantic
    assert True

def test_python_version():
    import sys
    assert sys.version_info >= (3, 10)

def test_pydantic_v2():
    import pydantic
    assert int(pydantic.__version__.split(".")[0]) == 2
