import subprocess

for _ in range(100):
    subprocess.run(["python", "real_device.py"])
    # No delay, "real_thing.py" will be run without any pause