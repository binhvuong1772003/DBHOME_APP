import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CiExport, CiSearch } from 'react-icons/ci';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useState, useMemo } from 'react';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useServiceManagement } from '@/hooks/useServiceManagement';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
export const ManageServiceForm = () => {
  const navigate = useNavigate();
  const { serviceList, isLoading, error } = useServiceManagement();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>(
    'all'
  );
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedServiceIds, setExpandedServiceIds] = useState<string[]>([]);
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
  ] as const;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handleStatusChange = async (serviceId: string, isActive: boolean) => {
    // TODO: Implement API call to update service status
    console.log(
      'Update service:',
      serviceId,
      'to',
      isActive ? 'Active' : 'Inactive'
    );
  };

  const sortedServiceList = useMemo(() => {
    if (!serviceList) return serviceList;

    // Filter by tab
    let filtered = [...serviceList];
    if (activeTab === 'active') {
      filtered = filtered.filter((service) => service.isActive);
    } else if (activeTab === 'inactive') {
      filtered = filtered.filter((service) => !service.isActive);
    }

    // Sort if sortColumn is set
    if (!sortColumn) return filtered;

    const sorted = filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortColumn) {
        case 'product':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          aValue = a.isActive ? 1 : 0;
          bValue = b.isActive ? 1 : 0;
          break;
        case 'category':
          aValue = a.categoryId || '';
          bValue = b.categoryId || '';
          break;
        case 'price':
          aValue = a.basePrice ?? 0;
          bValue = b.basePrice ?? 0;
          break;
        case 'duration':
          aValue = a.durationMin ?? 0;
          bValue = b.durationMin ?? 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [serviceList, activeTab, sortColumn, sortOrder]);

  return (
    <div>
      <Card className="border-none rounded-none">
        <CardContent className="flex justify-between items-center">
          <CardTitle className="text-base text-muted-foreground">
            Products
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline">
              <CiExport />
              Export
            </Button>
            <Button
              onClick={() => {
                navigate('create');
              }}
            >
              + Add Service
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="space-y-2 px-6">
        <Label className=" mt-4 text-base font-bold">My services</Label>
        <Card className="border-none rounded-b-sm">
          <CardHeader className="p-0 px-4">
            <div className="flex items-center justify-between">
              <div className="w-fit">
                <div className="flex flex-row gap-0">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      variant="ghost"
                      className={`w-20 px-4 rounded-none transition-colors ${
                        activeTab === tab.id
                          ? 'text-foreground font-semibold'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
                <div className="h-0.5 bg-border relative">
                  <div
                    className="absolute top-0 h-1 bg-primary transition-all duration-300"
                    style={{
                      left: `${(tabs.findIndex((t) => t.id === activeTab) / tabs.length) * 100}%`,
                      width: `${100 / tabs.length}%`,
                    }}
                  />
                </div>
              </div>
              <div className="relative max-w-xs">
                <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search products" className="pl-10" />
              </div>
            </div>
          </CardHeader>
        </Card>
        <div className="flex items-center gap-2 font-medium text-muted-foreground">
          <div className="mx-4 flex items-center w-96">
            <Checkbox />
            <Button
              variant="ghost"
              className="h-8"
              onClick={() => handleSort('product')}
            >
              Service
              {sortColumn === 'product' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
          </div>
          <Button
            variant="ghost"
            className="h-8 w-32 justify-start px-0"
            onClick={() => handleSort('status')}
          >
            Status
            {sortColumn === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-48 justify-start px-0"
            onClick={() => handleSort('category')}
          >
            Category
            {sortColumn === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-48 justify-start px-0"
            onClick={() => handleSort('price')}
          >
            Price {sortColumn === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-32 justify-start px-0"
            onClick={() => handleSort('duration')}
          >
            Duration
            {sortColumn === 'duration' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
        </div>
        <div>
          {sortedServiceList?.map((service) => {
            const isExpanded = expandedServiceIds.includes(service.id);
            return (
              <Card
                key={service.id}
                className="border-b rounded-none font-medium cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  if (isExpanded) {
                    setExpandedServiceIds(
                      expandedServiceIds.filter((id) => id !== service.id)
                    );
                  } else {
                    setExpandedServiceIds([...expandedServiceIds, service.id]);
                  }
                }}
              >
                <CardContent className="flex items-center gap-2 px-0">
                  <div className="mx-4 flex items-center w-96">
                    <Checkbox onClick={(e) => e.stopPropagation()} />
                    <span className="ml-2">{service.name}</span>
                  </div>
                  <div className="w-32" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`text-xs font-medium px-3 py-1 rounded-full ${
                            service.isActive
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(service.id, true)}
                          disabled={isLoading}
                        >
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(service.id, false)}
                          disabled={isLoading}
                        >
                          Inactive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="w-48">
                    <span>b</span>
                  </div>
                  <div className="w-48">
                    <span>{service.basePrice}</span>
                  </div>
                  <div className="w-32">
                    <span>{service.durationMin}</span>
                  </div>
                </CardContent>

                {isExpanded && (
                  <CardContent className="border-t bg-muted/30 py-4 px-0">
                    {service.options?.map((option) => (
                      <div key={option.id} className="mb-4">
                        <div className="flex items-center gap-2">
                          <div className="mx-4 w-96">
                            <Label className="text-sm font-semibold text-muted-foreground">
                              {option.name}
                            </Label>
                          </div>
                          <div className="w-32"></div>
                          <div className="w-48"></div>
                        </div>
                        {option.values?.map((value) => (
                          <div
                            key={value.id}
                            className="flex items-center gap-2"
                          >
                            <div className="mx-4 w-96">
                              <p>{value.name}</p>
                            </div>
                            <div className="w-32"></div>
                            <div className="w-48"></div>
                            <p className="w-48">
                              {value.price > 0
                                ? `+${value.price}`
                                : `-${value.price}`}
                            </p>
                            <p className="w-">
                              {value.price > 0
                                ? `+${value.duration}`
                                : `-${value.duration}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
