# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container
COPY . .

# Install the required packages
RUN pip install --no-cache-dir requests

# Make port 80 available to the world outside this container
EXPOSE 80

# Run api_interaction.py when the container launches
CMD ["python", "api_interaction.py"]
