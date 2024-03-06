from models import Site

# Create a new site instance
new_site = Site(siteName="Your Site Name", location="Site Location")

# Save the new site instance to the database
new_site.save()
