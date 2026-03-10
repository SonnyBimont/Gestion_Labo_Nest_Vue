<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiClient } from './services/api';

// --- TYPES ---
interface Supplier {
  id: number;
  name: string;
}

interface Item {
  id?: number;
  name: string;
  internalRef?: string;
  supplierRef: string;
  price?: number;
  quantity: number;
  isP2: boolean;
  lowStockThreshold?: number;
  supplierId?: number | null;
  supplier?: Supplier; // Objet imbriqué renvoyé par la jointure SQL
}

// --- ÉTAT ---
const items = ref<Item[]>([]);
const suppliers = ref<Supplier[]>([]); // Stockage des fournisseurs
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const editingId = ref<number | null>(null);
const decrementAmounts = ref<Record<number, number>>({});

// Initialisation du formulaire avec les nouveaux champs
const formItem = ref<Item>({
  name: '',
  internalRef: '',
  supplierRef: '',
  price: 0,
  quantity: 0,
  isP2: false,
  lowStockThreshold: 5,
  supplierId: null
});

// --- MÉTHODES API ---

const fetchItems = async () => {
  try {
    const response = await apiClient.get<Item[]>('/items');
    items.value = response.data;
    response.data.forEach(item => {
      if (item.id) decrementAmounts.value[item.id] = 1;
    });
  } catch (err) {
    error.value = "Erreur lors du chargement des équipements.";
  }
};

// Nouvelle méthode : Charger les fournisseurs
const fetchSuppliers = async () => {
  try {
    const response = await apiClient.get<Supplier[]>('/suppliers');
    suppliers.value = response.data;
  } catch (err) {
    console.error("Erreur lors du chargement des fournisseurs", err);
  }
};

const submitForm = async () => {
  error.value = null;
  successMessage.value = null;

  // Formatage strict pour le back-end
  const payload = {
    name: formItem.value.name,
    internalRef: formItem.value.internalRef || null,
    supplierRef: formItem.value.supplierRef,
    price: Number(formItem.value.price),
    quantity: Number(formItem.value.quantity),
    isP2: Boolean(formItem.value.isP2),
    lowStockThreshold: Number(formItem.value.lowStockThreshold),
    supplierId: formItem.value.supplierId || null
  };

  try {
    if (editingId.value) {
      const response = await apiClient.patch<Item>(`/items/${editingId.value}`, payload);
      const index = items.value.findIndex(i => i.id === editingId.value);
      if (index !== -1) items.value[index] = response.data;
      successMessage.value = "Équipement mis à jour.";
    } else {
      const response = await apiClient.post<Item>('/items', payload);
      items.value.push(response.data);
      if (response.data.id) decrementAmounts.value[response.data.id] = 1;
      successMessage.value = "Équipement ajouté.";
    }
    cancelEdit();
  } catch (err: any) {
    error.value = err.response?.data?.message || "Erreur lors de l'opération.";
  }
};

const useItem = async (item: Item) => {
  if (!item.id) return;
  const amountToUse = Number(decrementAmounts.value[item.id]);

  if (amountToUse <= 0 || amountToUse > item.quantity) {
    error.value = `Quantité invalide pour ${item.name}.`;
    return;
  }

  try {
    const response = await apiClient.post<Item>(`/items/${item.id}/decrement`, { amount: amountToUse });
    const index = items.value.findIndex(i => i.id === item.id);
    if (index !== -1) items.value[index] = response.data;
    decrementAmounts.value[item.id] = 1;
    successMessage.value = `Stock mis à jour.`;
  } catch (err: any) {
    error.value = err.response?.data?.message || "Erreur lors de la mise à jour.";
  }
};

const deleteItem = async (id: number) => {
  if (!confirm("Confirmer la suppression ?")) return;
  try {
    await apiClient.delete(`/items/${id}`);
    items.value = items.value.filter(item => item.id !== id);
    successMessage.value = "Équipement supprimé.";
  } catch (err) {
    error.value = "Erreur lors de la suppression.";
  }
};

const editItem = (item: Item) => {
  editingId.value = item.id as number;
  formItem.value = { ...item };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
  editingId.value = null;
  formItem.value = { name: '', internalRef: '', supplierRef: '', price: 0, quantity: 0, isP2: false, lowStockThreshold: 5, supplierId: null };
};

// Lancement des deux requêtes au démarrage
onMounted(() => {
  fetchItems();
  fetchSuppliers();
});
</script>

<template>
  <main class="container">
    <h1>Inventaire du Laboratoire</h1>

    <div v-if="error" class="alert error">{{ error }}</div>
    <div v-if="successMessage" class="alert success">{{ successMessage }}</div>

    <section class="form-section">
      <h2>{{ editingId ? 'Modifier l\'équipement' : 'Ajouter un équipement' }}</h2>
      <form @submit.prevent="submitForm" class="item-form">
        <div class="form-group">
          <label>Nom :</label>
          <input type="text" v-model="formItem.name" required />
        </div>
        <div class="form-group">
          <label>Réf. Interne :</label>
          <input type="text" v-model="formItem.internalRef" />
        </div>
        <div class="form-group">
          <label>Fournisseur :</label>
          <select v-model="formItem.supplierId" class="select-input">
            <option :value="null">-- Aucun --</option>
            <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
              {{ supplier.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Réf. Fournisseur :</label>
          <input type="text" v-model="formItem.supplierRef" required />
        </div>
        <div class="form-group">
          <label>Prix (€) :</label>
          <input type="number" step="0.01" v-model="formItem.price" min="0" />
        </div>
        <div class="form-group">
          <label>Quantité :</label>
          <input type="number" v-model="formItem.quantity" min="0" required />
        </div>
        <div class="form-group checkbox">
          <label><input type="checkbox" v-model="formItem.isP2" /> Zone P2</label>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">{{ editingId ? 'Mettre à jour' : 'Enregistrer' }}</button>
          <button type="button" v-if="editingId" @click="cancelEdit" class="btn-secondary">Annuler</button>
        </div>
      </form>
    </section>

    <section class="table-section">
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Réf. Interne</th>
            <th>Fournisseur</th>
            <th>Prix</th> <th>Stock</th>
            <th>Zone P2</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.internalRef || '-' }}</td>
            <td>{{ item.supplier?.name || 'Non défini' }}</td>
            <td>{{ item.price ? item.price + ' €' : '-' }}</td>
            <td :class="{ 'low-stock': item.quantity <= (item.lowStockThreshold || 5) }">{{ item.quantity }}</td>
            <td>{{ item.isP2 ? 'Oui' : 'Non' }}</td>
            <td class="actions-cell">
              <div class="use-action">
                <input type="number" v-model.number="decrementAmounts[item.id!]" min="1" :max="item.quantity" class="small-input" />
                <button @click="useItem(item)" class="btn-sm btn-warning" :disabled="item.quantity === 0">Utiliser</button>
              </div>
              <div class="manage-actions">
                <button @click="editItem(item)" class="btn-sm btn-info">Modifier</button>
                <button @click="deleteItem(item.id!)" class="btn-sm btn-danger">Supprimer</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else-if="!error">Aucun équipement enregistré.</p>
    </section>
  </main>
</template>

<style scoped>
/* Les styles existants sont conservés, ajout des règles pour les nouveaux boutons */
.container { max-width: 1000px; margin: 2rem auto; font-family: system-ui, sans-serif; color: #213547; }
table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
th, td { border: 1px solid #ddd; padding: 10px; text-align: left; vertical-align: middle; }
th { background-color: #f8f9fa; font-weight: 600; }
.low-stock { color: #dc3545; font-weight: bold; }
.alert { padding: 10px; border-radius: 4px; margin-bottom: 1rem; }
.error { color: #721c24; background-color: #f8d7da; }
.success { color: #155724; background-color: #d4edda; }

.form-section { background: rgba(0, 0, 0, 0.05); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; }
.item-form { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; }
.form-group { display: flex; flex-direction: column; }
input[type="text"], input[type="number"] { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }

/* Styles des boutons et actions */
button { padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; color: white;}
.btn-primary { background-color: #007bff; }
.btn-primary:hover { background-color: #0056b3; }
.btn-secondary { background-color: #6c757d; color: white; }
.btn-sm { padding: 5px 8px; font-size: 0.85rem; }
.btn-warning { background-color: #ffc107; color: #212529; }
.btn-info { background-color: #17a2b8; }
.btn-danger { background-color: #dc3545; }

.actions-cell { display: flex; flex-direction: column; gap: 8px; }
.use-action { display: flex; gap: 5px; }
.manage-actions { display: flex; gap: 5px; }
.small-input { width: 60px; padding: 4px !important; }

/* Adaptation mode sombre */
@media (prefers-color-scheme: dark) {
  .container { color: #e0e0e0; }
  th, td { border-color: #444; }
  th { background-color: #2c2c2c; }
  .form-section { background: rgba(255, 255, 255, 0.05); }
  input[type="text"], input[type="number"] { background: #333; color: white; border-color: #555; }
  .error { color: #ffb3b3; background-color: #4a1919; }
  .success { color: #98e8a7; background-color: #1c3d23; }
  .low-stock { color: #ff6b6b; }
}
</style>
