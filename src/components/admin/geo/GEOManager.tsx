import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart2, FileSearch, Code, Award, Globe, Sparkles, Zap } from 'lucide-react';
import { CitationDashboard } from './CitationDashboard';
import { ContentAuditor } from './ContentAuditor';
import { SchemaGenerator } from './SchemaGenerator';
import { AuthorityOptimizer } from './AuthorityOptimizer';
import { AIBrowserSimulator } from './AIBrowserSimulator';
import { BlogGEODashboard } from './BlogGEODashboard';

export function GEOManager() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary bg-gradient-to-r from-primary/10 to-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Otimização GEO (Generative Engine Optimization)</CardTitle>
              <CardDescription>
                Otimize como sua marca é citada por ChatGPT, Perplexity, Google AI e outros motores de resposta
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1">
              <span className="text-green-500">●</span> Perplexity
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <span className="text-green-500">●</span> ChatGPT
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <span className="text-green-500">●</span> Google AI Overview
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <span className="text-amber-500">●</span> Claude
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <span className="text-green-500">●</span> Bing Copilot
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="unified" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="unified" className="gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden md:inline">Blog + GEO</span>
          </TabsTrigger>
          <TabsTrigger value="citations" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden md:inline">Citações</span>
          </TabsTrigger>
          <TabsTrigger value="auditor" className="gap-2">
            <FileSearch className="h-4 w-4" />
            <span className="hidden md:inline">Auditor</span>
          </TabsTrigger>
          <TabsTrigger value="schema" className="gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden md:inline">Schema</span>
          </TabsTrigger>
          <TabsTrigger value="authority" className="gap-2">
            <Award className="h-4 w-4" />
            <span className="hidden md:inline">Autoridade</span>
          </TabsTrigger>
          <TabsTrigger value="simulator" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Simulador</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unified">
          <BlogGEODashboard />
        </TabsContent>

        <TabsContent value="citations">
          <CitationDashboard />
        </TabsContent>

        <TabsContent value="auditor">
          <ContentAuditor />
        </TabsContent>

        <TabsContent value="schema">
          <SchemaGenerator />
        </TabsContent>

        <TabsContent value="authority">
          <AuthorityOptimizer />
        </TabsContent>

        <TabsContent value="simulator">
          <AIBrowserSimulator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
