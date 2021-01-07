FROM nikolaik/python-nodejs:python3.8-nodejs14 as base

WORKDIR /var/www
COPY . .

# Install Python Dependencies
RUN ["pip", "install", "-r", "requirements.txt"]
RUN ["pip", "install", "psycopg2"]


# Build our React App
RUN ["npm", "install", "--prefix", "client"]
RUN ["npm", "run", "build", "--prefix", "client"]

# Move our react build for Flask to serve
# Use cp here because we're copying files inside our working directory, not from
# our host machine.
RUN ["cp", "-r", "client/build", "net_assign/static"]
RUN ["cp", "-r", "net_assign/static/static/js", "net_assign/static"]
RUN ["cp", "-r", "net_assign/static/static/css", "net_assign/static"]

# Setup Flask environment
ENV FLASK_APP=net_assign
ENV FLASK_ENV=production
ENV SQLALCHEMY_ECHO=True

EXPOSE 8000

# Run flask environment
CMD gunicorn net_assign:app
