import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

/* 动态 API 包括：
*
* 提供给页面、布局、元数据 API 和路由处理程序的 and props。paramssearchParams
* cookies()、 和 fromdraftMode()headers()next / headers
* 在 Next 15 中，这些 API 已异步。您可以在 Next.js 15 升级指南中阅读更多相关信息。 */

/* https://nextjs.org/docs/messages/sync-dynamic-apis */

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
