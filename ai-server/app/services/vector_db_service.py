import chromadb
from chromadb.config import Settings as ChromaSettings
from app.core.config import settings
import os

class VectorDBService:
    def __init__(self):
        # Ensure path exists
        if not os.path.exists(settings.CHROMA_DB_PATH):
            os.makedirs(settings.CHROMA_DB_PATH)
        
        self.client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
        self.collection = self.client.get_or_create_collection(name="ocr_receipts")

    def add_document(self, doc_id: str, text: str, metadata: dict = None):
        """
        Add extracted text to the vector database.
        """
        self.collection.add(
            documents=[text],
            metadatas=[metadata or {}],
            ids=[doc_id]
        )

    def query_document(self, query_text: str, n_results: int = 5):
        """
        Query the vector database for similar content.
        """
        return self.collection.query(
            query_texts=[query_text],
            n_results=n_results
        )

vector_db_service = VectorDBService()
