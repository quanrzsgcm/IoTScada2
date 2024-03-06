import uuid
from django.db import models
from iot.models import Site
class Connection(models.Model):
    connection_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    connection_type = models.CharField(max_length=100)
    uri = models.CharField(max_length=255)
    source_addresses = models.CharField(max_length=255)
    # ForeignKey field for site reference
    site = models.ForeignKey(Site, on_delete=models.CASCADE)  # ForeignKey reference to Site model

    def __str__(self):
        return f"{self.connection_type} - {self.site.name}"
