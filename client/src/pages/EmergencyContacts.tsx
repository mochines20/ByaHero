import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Trash2, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/uiStore';
import { api } from '../lib/api';

export function EmergencyContactsPage() {
  const user = useAuthStore((s) => s.user);
  const [contacts, setContacts] = useState<string[]>(user?.emergencyContacts || []);
  const [newContact, setNewContact] = useState('');
  const [loading, setLoading] = useState(false);
  const pushToast = useToastStore((s) => s.pushToast);

  const addContact = async () => {
    if (!newContact.trim()) {
      pushToast('Please enter a contact');
      return;
    }

    setLoading(true);
    try {
      const updatedContacts = [...contacts, newContact];
      await api.put('/users/profile', {
        emergencyContacts: updatedContacts,
      });
      setContacts(updatedContacts);
      setNewContact('');
      pushToast('Contact added successfully');
    } catch (error: any) {
      pushToast(error.message || 'Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  const removeContact = async (contact: string) => {
    setLoading(true);
    try {
      const updatedContacts = contacts.filter((c) => c !== contact);
      await api.put('/users/profile', {
        emergencyContacts: updatedContacts,
      });
      setContacts(updatedContacts);
      pushToast('Contact removed successfully');
    } catch (error: any) {
      pushToast(error.message || 'Failed to remove contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-2xl space-y-4'>
      <div>
        <h1 className='text-2xl font-bold text-byahero-navy'>Emergency Contacts</h1>
        <p className='text-byahero-muted'>
        These contacts will be notified when you trigger the SOS button.
        </p>
      </div>

      <Card>
        <div className='flex gap-2'>
          <Input
            value={newContact}
            onChange={(e) => setNewContact(e.target.value)}
            placeholder='Name or phone number'
            disabled={loading}
          />
          <Button onClick={addContact} disabled={loading}>
            <Plus size={18} className='mr-1' /> Add
          </Button>
        </div>
      </Card>

      <div className='space-y-2'>
        {contacts.length === 0 ? (
          <p className='text-byahero-muted'>No emergency contacts yet</p>
        ) : (
          contacts.map((contact, idx) => (
            <Card key={idx} className='flex items-center justify-between p-3'>
              <span className='font-medium'>{contact}</span>
              <button
                onClick={() => removeContact(contact)}
                disabled={loading}
                className='text-red-600 hover:text-red-700'
              >
                <Trash2 size={18} />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
