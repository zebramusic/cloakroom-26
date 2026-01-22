"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomerNav from "@/components/customer/CustomerNav";
import AddressForm from "@/components/customer/AddressForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  User,
  MapPin,
  Lock,
  Mail,
  Phone,
  Building2,
  Globe,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Address {
  _id?: string;
  label: string;
  street: string;
  city: string;
  county?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

interface Customer {
  _id: string;
  email: string;
  name: string;
  companyName?: string;
  phone?: string;
  cui?: string;
  vatNumber?: string;
  localePreference: "ro" | "en";
  billingAddress?: {
    street: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
  };
  shippingAddresses?: Address[];
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Personal info form
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    companyName: "",
    phone: "",
    cui: "",
    vatNumber: "",
    localePreference: "ro" as "ro" | "en",
  });

  // Billing address form
  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    county: "",
    postalCode: "",
    country: "RO",
  });

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Address dialog state
  const [addressDialog, setAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | undefined>(
    undefined,
  );
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/customer/profile");
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/account/login");
          return;
        }
        throw new Error(data.error || "Failed to fetch profile");
      }

      setCustomer(data.customer);
      setPersonalInfo({
        name: data.customer.name || "",
        companyName: data.customer.companyName || "",
        phone: data.customer.phone || "",
        cui: data.customer.cui || "",
        vatNumber: data.customer.vatNumber || "",
        localePreference: data.customer.localePreference || "ro",
      });
      setBillingAddress(
        data.customer.billingAddress || {
          street: "",
          city: "",
          county: "",
          postalCode: "",
          country: "RO",
        },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePersonalInfo = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personalInfo),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("Profile updated successfully");
      setCustomer(data.customer);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBillingAddress = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update billing address");
      }

      setSuccess("Billing address updated successfully");
      setCustomer(data.customer);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update billing address",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/customer/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      setSuccess("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setDeletingAddressId(addressId);

    try {
      const response = await fetch(
        `/api/customer/profile/addresses/${addressId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete address");
      }

      await fetchProfile();
      setSuccess("Address deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete address");
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleAddressSuccess = async () => {
    setAddressDialog(false);
    setEditingAddress(undefined);
    await fetchProfile();
    setSuccess("Address saved successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerNav userName="Loading..." />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerNav userName={customer.name} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">
              <User className="h-4 w-4 mr-2" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="h-4 w-4 mr-2" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <Input
                      id="email"
                      value={customer.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={personalInfo.name}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                    <Input
                      id="companyName"
                      value={personalInfo.companyName}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          companyName: e.target.value,
                        })
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <Input
                        id="phone"
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+40..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="locale">Language</Label>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-400 mr-2" />
                      <Select
                        value={personalInfo.localePreference}
                        onValueChange={(value: "ro" | "en") =>
                          setPersonalInfo({
                            ...personalInfo,
                            localePreference: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ro">Română</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cui">CUI (Tax ID)</Label>
                    <Input
                      id="cui"
                      value={personalInfo.cui}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          cui: e.target.value,
                        })
                      }
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vatNumber">VAT Number</Label>
                    <Input
                      id="vatNumber"
                      value={personalInfo.vatNumber}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          vatNumber: e.target.value,
                        })
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSavePersonalInfo} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>Used for invoices and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="billingStreet">Street Address</Label>
                  <Input
                    id="billingStreet"
                    value={billingAddress.street}
                    onChange={(e) =>
                      setBillingAddress({
                        ...billingAddress,
                        street: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billingCity">City</Label>
                    <Input
                      id="billingCity"
                      value={billingAddress.city}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingCounty">County</Label>
                    <Input
                      id="billingCounty"
                      value={billingAddress.county}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          county: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billingPostalCode">Postal Code</Label>
                    <Input
                      id="billingPostalCode"
                      value={billingAddress.postalCode}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          postalCode: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="billingCountry">Country</Label>
                    <Input
                      id="billingCountry"
                      value={billingAddress.country}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          country: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveBillingAddress} disabled={saving}>
                    {saving ? "Saving..." : "Save Billing Address"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Shipping Addresses</CardTitle>
                    <CardDescription>
                      Manage your delivery addresses
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingAddress(undefined);
                      setAddressDialog(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!customer.shippingAddresses ||
                customer.shippingAddresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      No shipping addresses yet
                    </p>
                    <Button onClick={() => setAddressDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Address
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customer.shippingAddresses.map((address) => (
                      <div
                        key={address._id}
                        className="border rounded-lg p-4 flex items-start justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{address.label}</h4>
                            {address.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.street}
                            <br />
                            {address.city}
                            {address.county && `, ${address.county}`}
                            {address.postalCode && ` ${address.postalCode}`}
                            <br />
                            {address.country || "RO"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingAddress(address);
                              setAddressDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAddress(address._id!)}
                            disabled={deletingAddressId === address._id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      required
                      minLength={8}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Must be at least 8 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={saving}>
                      {saving ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Address Dialog */}
      <Dialog open={addressDialog} onOpenChange={setAddressDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              {editingAddress
                ? "Update your shipping address details"
                : "Add a new shipping address to your account"}
            </DialogDescription>
          </DialogHeader>
          <AddressForm
            address={editingAddress}
            onSuccess={handleAddressSuccess}
            onCancel={() => {
              setAddressDialog(false);
              setEditingAddress(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
