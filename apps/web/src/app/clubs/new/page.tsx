'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import { getCurrentUser } from '@/lib/currentUser';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { Notice } from '@/components/ui/Feedback';
import { Page } from '@/components/ui/Page';
import { PageHeader } from '@/components/ui/PageHeader';

export default function NewClubPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      setError('Set your organizer name/email at the top of the page first.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const club = await api.createClub({ ownerId: user.id, name, description });
      router.push(`/clubs/${club.id}`);
    } catch {
      setError('Could not create the club — is the API running?');
      setSubmitting(false);
    }
  }

  return (
    <Page width="sm">
      <PageHeader title="Create a club" subtitle="Players join with the code we generate." />
      <Card>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <Field label="Club name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tuesday Night Open Play"
              required
            />
          </Field>
          <Field label="Description (optional)">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Weekly open play at Sunrise Courts, all levels welcome."
            />
          </Field>
          {error && <Notice>{error}</Notice>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create club'}
          </Button>
        </form>
      </Card>
    </Page>
  );
}
