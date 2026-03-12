import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
  FileText,
  Download,
  Plus,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  Receipt,
  Eye,
  Loader2,
  User,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import {createDevis , getOrderDocuments } from "@/Services/FinanceService";

function OrderFinancialSection({ orderId, orderData }) {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingDevis, setIsCreatingDevis] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total_items: 0 });

  useEffect(() => {
    fetchDocuments();
  }, [orderId]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const [documentsData, paginationData] = await getOrderDocuments(orderId);
      setDocuments(documentsData || []);
      setPagination(paginationData || { page: 1, total_pages: 1, total_items: 0 });
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      toast.error("Failed to load financial documents");
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDevis = async () => {
    if (!orderData?.company?.id) {
      toast.error("Company information is missing");
      return;
    }

    setIsCreatingDevis(true);
    try {
      const data = {
        order_id: orderId,
        company_id: orderData.company.id,
      };

      await createDevis(data);
      toast.success("Quote created successfully");
      
      // Refresh documents list
      await fetchDocuments();
    } catch (error) {
      console.error("Failed to create devis:", error);
      toast.error("Failed to create quote");
    } finally {
      setIsCreatingDevis(false);
    }
  };

  // Separate documents by type
  const devis = documents.filter(doc => doc.document_type === "DEVIS");
  const factures = documents.filter(doc => doc.document_type === "FACTURE");

  // Calculate all payments from all factures
  const allPayments = factures.flatMap(facture => 
    facture.payments.map(payment => ({
      ...payment,
      facture_number: facture.document_number,
      facture_id: facture.id,
    }))
  );

  // Financial calculations
  const totalQuoted = devis.reduce((sum, d) => sum + (d.total || 0), 0);
  const totalInvoiced = factures.reduce((sum, f) => sum + (f.total || 0), 0);
  const totalPaid = factures.reduce((sum, f) => sum + (f.total_paid || 0), 0);
  const totalRemaining = factures.reduce((sum, f) => sum + (f.total_remaining || 0), 0);

  const getDocumentStatusConfig = (status) => {
    const configs = {
      DRAFT: {
        color: "bg-slate-50 text-slate-700 border-slate-200",
        icon: FileText,
        label: "Draft"
      },
      PENDING: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
        label: "Pending"
      },
      APPROVED: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle,
        label: "Approved"
      },
      PAID: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle,
        label: "Paid"
      },
      PARTIAL_PAID: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: CreditCard,
        label: "Partial Paid"
      },
      CANCELLED: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
        label: "Cancelled"
      },
    };
    return configs[status] || configs.DRAFT;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `${(amount || 0).toLocaleString()} DZD`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600">Loading financial documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Financial Summary</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Total Quoted</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalQuoted)}</p>
              <p className="text-xs text-slate-500">{devis.length} quote(s)</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Total Invoiced</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalInvoiced)}</p>
              <p className="text-xs text-slate-500">{factures.length} invoice(s)</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
              <p className="text-xs text-slate-500">{allPayments.length} payment(s)</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">Remaining</p>
              <p className={`text-2xl font-bold ${totalRemaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(totalRemaining)}
              </p>
              <p className="text-xs text-slate-500">
                {totalRemaining > 0 ? 'Outstanding' : 'Fully paid'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes (DEVIS) Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Quotes (Devis)</h2>
                <p className="text-sm text-slate-600">{devis.length} quote(s) generated</p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="gap-2 bg-slate-900 hover:bg-slate-800"
              onClick={handleCreateDevis}
              disabled={isCreatingDevis}
            >
              {isCreatingDevis ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  New Quote
                </>
              )}
            </Button>
          </div>

          {devis.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No quotes generated yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {devis.map((quote) => {
                const statusConfig = getDocumentStatusConfig(quote.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div key={quote.id} className="border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors bg-white">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-slate-900 text-lg">{quote.document_number}</h3>
                          <Badge variant="outline" className={`${statusConfig.color} border gap-1.5`}>
                            <StatusIcon size={12} />
                            {statusConfig.label}
                          </Badge>
                        </div>

                        {/* Financial Details */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Total HT</p>
                            <p className="text-sm font-semibold text-slate-900">{formatCurrency(quote.total_ht)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Total TTC</p>
                            <p className="text-sm font-semibold text-slate-900">{formatCurrency(quote.total)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Remaining</p>
                            <p className="text-sm font-semibold text-red-600">{formatCurrency(quote.total_remaining)}</p>
                          </div>
                        </div>

                        {/* Meta Information */}
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>By: {quote.creator?.username}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 size={14} />
                            <span>{quote.company?.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>{formatDate(quote.created_at)}</span>
                          </div>
                        </div>

                        {/* Approval Info */}
                        {quote.approved_at && quote.approver && (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                            <CheckCircle size={14} />
                            <span>Approved by {quote.approver.username} on {formatDate(quote.approved_at)}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-2 border-slate-300">
                          <Eye size={14} />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2 border-slate-300">
                          <Download size={14} />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoices (FACTURE) Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Receipt size={20} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Invoices (Factures)</h2>
                <p className="text-sm text-slate-600">{factures.length} invoice(s) issued</p>
              </div>
            </div>
            <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Plus size={16} />
              New Invoice
            </Button>
          </div>

          {factures.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No invoices issued yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {factures.map((facture) => {
                const statusConfig = getDocumentStatusConfig(facture.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div key={facture.id} className="border border-slate-200 rounded-lg p-5 hover:border-slate-300 transition-colors bg-white">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-slate-900 text-lg">{facture.document_number}</h3>
                          <Badge variant="outline" className={`${statusConfig.color} border gap-1.5`}>
                            <StatusIcon size={12} />
                            {statusConfig.label}
                          </Badge>
                          {facture.devis_id && (
                            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                              From Quote
                            </Badge>
                          )}
                        </div>

                        {/* Financial Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Total HT</p>
                            <p className="text-sm font-semibold text-slate-900">{formatCurrency(facture.total_ht)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Total TTC</p>
                            <p className="text-sm font-semibold text-slate-900">{formatCurrency(facture.total)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Paid</p>
                            <p className="text-sm font-semibold text-green-600">{formatCurrency(facture.total_paid)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Remaining</p>
                            <p className={`text-sm font-semibold ${facture.total_remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {formatCurrency(facture.total_remaining)}
                            </p>
                          </div>
                        </div>

                        {/* Meta Information */}
                        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>By: {facture.creator?.username}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 size={14} />
                            <span>{facture.company?.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>{formatDate(facture.created_at)}</span>
                          </div>
                        </div>

                        {/* Payments List */}
                        {facture.payments.length > 0 && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <CreditCard size={16} className="text-green-600" />
                              <h4 className="font-semibold text-green-900">Payments ({facture.payments.length})</h4>
                            </div>
                            <div className="space-y-2">
                              {facture.payments.map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium text-green-900">{formatCurrency(payment.amount)}</span>
                                    <span className="text-green-700">via {payment.payment_method}</span>
                                  </div>
                                  <span className="text-green-600">{formatDate(payment.created_at)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Approval Info */}
                        {facture.approved_at && facture.approver && (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                            <CheckCircle size={14} />
                            <span>Approved by {facture.approver.username} on {formatDate(facture.approved_at)}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-2 border-slate-300">
                          <Eye size={14} />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2 border-slate-300">
                          <Download size={14} />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default OrderFinancialSection;